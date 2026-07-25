import { pool } from '../config/mysql.js';

class ModelQuery {
  constructor(collectionName, queryFn) {
    this.collectionName = collectionName;
    this.queryFn = queryFn;
    this.populates = [];
    this.selections = [];
  }

  populate(path, selectFields) {
    this.populates.push({ path, selectFields });
    return this;
  }

  select(fields) {
    this.selections.push(fields);
    return this;
  }

  async exec() {
    let result = await this.queryFn();

    // Parse JSON fields
    if (Array.isArray(result)) {
      result = result.map(parseRow);
    } else if (result) {
      result = parseRow(result);
    }

    // Apply populate
    if (this.populates.length > 0) {
      if (Array.isArray(result)) {
        result = await Promise.all(result.map(async item => {
          let updatedItem = { ...item };
          for (const p of this.populates) {
            updatedItem = await performPopulate(updatedItem, p.path, p.selectFields);
          }
          return updatedItem;
        }));
      } else if (result) {
        let updatedItem = { ...result };
        for (const p of this.populates) {
          updatedItem = await performPopulate(updatedItem, p.path, p.selectFields);
        }
        result = updatedItem;
      }
    }

    // Apply select/exclusions
    if (this.selections.length > 0) {
      const selectFields = this.selections.join(' ');
      const fields = selectFields.split(/\s+/).filter(Boolean);
      
      const processSelect = (obj) => {
        if (!obj) return obj;
        let filtered = {};
        if (fields.some(f => f.startsWith('-'))) {
          const exclusions = fields.map(f => f.substring(1));
          for (const k of Object.keys(obj)) {
            if (!exclusions.includes(k)) {
              filtered[k] = obj[k];
            }
          }
        } else {
          for (const f of fields) {
            filtered[f] = obj[f];
          }
          filtered._id = obj._id;
        }
        return filtered;
      };

      if (Array.isArray(result)) {
        result = result.map(processSelect);
      } else if (result) {
        result = processSelect(result);
      }
    }

    // Mock toObject method for all objects
    const addMockMethods = (obj) => {
      if (!obj) return obj;
      if (typeof obj === 'object') {
        const cloned = { ...obj };
        cloned.toObject = function() {
          const res = { ...this };
          delete res.toObject;
          return res;
        };
        return cloned;
      }
      return obj;
    };

    if (Array.isArray(result)) {
      result = result.map(addMockMethods);
    } else if (result) {
      result = addMockMethods(result);
    }

    return result;
  }

  then(onfulfilled, onrejected) {
    return this.exec().then(onfulfilled, onrejected);
  }

  catch(onrejected) {
    return this.exec().catch(onrejected);
  }
}

const parseRow = (row) => {
  if (!row) return row;
  const parsed = { ...row };
  for (const [key, value] of Object.entries(parsed)) {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
          parsed[key] = JSON.parse(value);
        } catch (e) {
          // Keep original string if not valid JSON
        }
      }
    }
  }
  return parsed;
};

const serializeFields = (data) => {
  if (!data) return data;
  const serialized = { ...data };
  for (const [key, value] of Object.entries(serialized)) {
    if (value && typeof value === 'object' && !(value instanceof Date)) {
      serialized[key] = JSON.stringify(value);
    }
  }
  return serialized;
};

const performPopulate = async (item, path, selectFields) => {
  if (!item || !item[path]) return item;
  if (!pool) return item;
  const collectionName = path === 'user' ? 'users' : path + 's';
  const referencedId = item[path];
  
  if (typeof referencedId === 'string') {
    const [rows] = await pool.query(`SELECT * FROM \`${collectionName}\` WHERE _id = ?`, [referencedId]);
    if (rows && rows.length > 0) {
      let populated = parseRow(rows[0]);
      if (selectFields) {
        const fields = selectFields.split(/\s+/).filter(Boolean);
        const filtered = {};
        if (fields.some(f => f.startsWith('-'))) {
          const exclusions = fields.map(f => f.substring(1));
          for (const k of Object.keys(populated)) {
            if (!exclusions.includes(k)) {
              filtered[k] = populated[k];
            }
          }
        } else {
          for (const f of fields) {
            filtered[f] = populated[f];
          }
          filtered._id = populated._id;
        }
        populated = filtered;
      }
      return { ...item, [path]: populated };
    }
  }
  return item;
};

export const createModelWrapper = (collectionName) => {
  return {
    find: (query = {}) => {
      return new ModelQuery(collectionName, async () => {
        if (!pool) return [];
        const keys = Object.keys(query);
        if (keys.length === 0) {
          const [rows] = await pool.query(`SELECT * FROM \`${collectionName}\``);
          return rows;
        }
        const whereClause = keys.map(k => `\`${k}\` = ?`).join(' AND ');
        const values = keys.map(k => {
          const v = query[k];
          return typeof v === 'object' && v !== null && !(v instanceof Date) ? JSON.stringify(v) : v;
        });
        const [rows] = await pool.query(`SELECT * FROM \`${collectionName}\` WHERE ${whereClause}`, values);
        return rows;
      });
    },

    findOne: (query = {}) => {
      return new ModelQuery(collectionName, async () => {
        if (!pool) return null;
        const keys = Object.keys(query);
        let rows;
        if (keys.length === 0) {
          [rows] = await pool.query(`SELECT * FROM \`${collectionName}\` LIMIT 1`);
        } else {
          const whereClause = keys.map(k => `\`${k}\` = ?`).join(' AND ');
          const values = keys.map(k => {
            const v = query[k];
            return typeof v === 'object' && v !== null && !(v instanceof Date) ? JSON.stringify(v) : v;
          });
          [rows] = await pool.query(`SELECT * FROM \`${collectionName}\` WHERE ${whereClause} LIMIT 1`, values);
        }
        return rows && rows.length > 0 ? rows[0] : null;
      });
    },

    findById: (id) => {
      return new ModelQuery(collectionName, async () => {
        if (!pool) return null;
        const [rows] = await pool.query(`SELECT * FROM \`${collectionName}\` WHERE _id = ? LIMIT 1`, [id]);
        return rows && rows.length > 0 ? rows[0] : null;
      });
    },

    create: async (data) => {
      const id = data._id || `mock-${collectionName.slice(0, -1)}-${Date.now()}`;
      const fullData = { _id: id, ...data };
      
      const created = parseRow(fullData);
      created.toObject = function() {
        const res = { ...this };
        delete res.toObject;
        return res;
      };

      if (!pool) return created;

      const serialized = serializeFields(fullData);
      const columns = Object.keys(serialized);
      const placeholders = columns.map(() => '?').join(', ');
      const columnNames = columns.map(c => `\`${c}\``).join(', ');
      const values = Object.values(serialized);
      
      await pool.query(
        `INSERT INTO \`${collectionName}\` (${columnNames}) VALUES (${placeholders})`,
        values
      );
      
      return created;
    },

    findByIdAndUpdate: (id, update, options = {}) => {
      return new ModelQuery(collectionName, async () => {
        if (!pool) return { _id: id, ...update };
        const serialized = serializeFields(update);
        const keys = Object.keys(serialized);
        if (keys.length === 0) {
          const [rows] = await pool.query(`SELECT * FROM \`${collectionName}\` WHERE _id = ? LIMIT 1`, [id]);
          return rows && rows.length > 0 ? rows[0] : null;
        }
        const setClause = keys.map(k => `\`${k}\` = ?`).join(', ');
        const values = [...Object.values(serialized), id];
        
        await pool.query(`UPDATE \`${collectionName}\` SET ${setClause} WHERE _id = ?`, values);
        
        const [rows] = await pool.query(`SELECT * FROM \`${collectionName}\` WHERE _id = ? LIMIT 1`, [id]);
        return rows && rows.length > 0 ? rows[0] : null;
      });
    }
  };
};
