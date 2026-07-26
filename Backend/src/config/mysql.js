import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export let pool = null;

const INITIAL_USERS = [
  {
    _id: 'mock-user-111',
    name: 'Rajesh Kumar',
    phone: '9876543210',
    password: 'mockpasswordhashed', // dummy
    village: 'Milak',
    district: 'Rampur',
    state: 'Uttar Pradesh',
    gpsLocation: JSON.stringify({ latitude: 28.6139, longitude: 77.2090 }),
    landArea: 3.5,
    landOwnership: 'Owned',
    soilType: 'Alluvial (Loamy)',
    irrigationSource: 'Tube Well',
    waterAvailability: 'Moderate',
    annualIncome: 120000,
    category: 'OBC',
    currentCrops: JSON.stringify(['Paddy']),
    previousCrops: JSON.stringify(['Wheat', 'Mustard']),
    farmingExperience: 12,
    preferredLanguage: 'Hindi'
  }
];

const INITIAL_FARMS = [
  {
    _id: 'mock-farm-111',
    user: 'mock-user-111',
    name: 'My Farm Twin',
    boundaries: JSON.stringify([
      { latitude: 28.6139, longitude: 77.2090 },
      { latitude: 28.6145, longitude: 77.2095 },
      { latitude: 28.6140, longitude: 77.2105 },
      { latitude: 28.6135, longitude: 77.2100 }
    ]),
    soilProfile: JSON.stringify({ pH: 6.8, moisture: 48, nitrogen: 110, phosphorus: 38, potassium: 195 }),
    waterMetrics: JSON.stringify({ waterScore: 85, waterStressLevel: 'Low' }),
    cropStatus: JSON.stringify({ cropName: 'Paddy', stage: 'Vegetative', growthPercentage: 35, estimatedYield: 4.2 })
  }
];

const INITIAL_PRODUCES = [
  {
    _id: 'mock-produce-1',
    user: 'mock-user-111',
    cropName: 'Paddy',
    quantity: 12.0,
    grade: 'Good (A)',
    estimatedPrice: 2100.0,
    harvestDate: new Date(),
    status: 'Listing',
    location: JSON.stringify({ village: 'Milak', district: 'Rampur' })
  }
];

const INITIAL_SCHEMES = [
  {
    _id: 'mock-scheme-1',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    description: 'Provides ₹6,000 yearly income support in three equal installments directly to bank accounts.',
    state: 'All',
    maxLandSize: 5.0,
    minLandSize: 0.0,
    allowedCategories: JSON.stringify(['General', 'OBC', 'SC', 'ST']),
    minFarmingExperience: 0,
    benefits: '₹6,000 cash subsidy per annum.',
    requiredDocuments: JSON.stringify(['Aadhaar Card', 'Land Registry Copies (Fard/Khatauni)', 'Bank Passbook']),
    deadline: new Date('2026-10-31')
  },
  {
    _id: 'mock-scheme-2',
    name: 'PM Fasal Bima Yojana (Crop Insurance)',
    description: 'Comprehensive insurance cover against crop failure due to weather or natural calamities.',
    state: 'All',
    maxLandSize: null,
    minLandSize: 0.0,
    allowedCategories: JSON.stringify(['General', 'OBC', 'SC', 'ST']),
    minFarmingExperience: 0,
    benefits: 'Up to 90% premium subsidy, payouts in case of drought/floods.',
    requiredDocuments: JSON.stringify(['Aadhaar Card', 'Land Sowing Certificate', 'Bank details']),
    deadline: new Date('2026-08-15')
  },
  {
    _id: 'mock-scheme-3',
    name: 'Per Drop More Crop (Micro Irrigation Subsidy)',
    description: 'Promotes water conservation through subsidies on drip and sprinkler irrigation installations.',
    state: 'All',
    maxLandSize: 10.0,
    minLandSize: 0.0,
    allowedCategories: JSON.stringify(['OBC', 'SC', 'ST']),
    minFarmingExperience: 0,
    benefits: '85% to 90% subsidy on installation costs of drip systems.',
    requiredDocuments: JSON.stringify(['Aadhaar Card', 'Soil & Water Testing Report', 'Quotation from approved drip dealer']),
    deadline: new Date('2026-09-30')
  },
  {
    _id: 'mock-scheme-4',
    name: 'Paramparagat Krishi Vikas Yojana (Organic Farming Support)',
    description: 'Promotes organic farming practices through cluster formation and PGS certification assistance.',
    state: 'Uttar Pradesh',
    maxLandSize: 5.0,
    minLandSize: 0.0,
    allowedCategories: JSON.stringify(['General', 'OBC', 'SC', 'ST']),
    minFarmingExperience: 0,
    benefits: '₹50,000 per hectare support over 3 years for inputs and certification.',
    requiredDocuments: JSON.stringify(['Aadhaar Card', 'Land Record', 'Soil Testing Certificate']),
    deadline: new Date('2026-11-15')
  }
];

export const initMySQL = async () => {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_DATABASE || 'apnakissan';

  console.log(`[MySQL] Connecting to MySQL Server at ${host}:${port} as ${user}...`);

  // First connect without database to ensure database exists
  const connection = await mysql.createConnection({ host, port, user, password });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
  await connection.end();

  // Create connection pool targeting the database
  pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Verify connection pool
  const conn = await pool.getConnection();
  console.log(`[MySQL] Connected to database: "${database}" successfully.`);
  conn.release();

  // Initialize tables
  await createTables();

  // Seed data if empty
  await seedData();
};

const createTables = async () => {
  console.log('[MySQL] Ensuring database tables are initialized...');

  // Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      _id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      village VARCHAR(255),
      district VARCHAR(255),
      state VARCHAR(255),
      gpsLocation TEXT,
      aadhaar VARCHAR(255),
      landArea FLOAT,
      landOwnership VARCHAR(255),
      soilType VARCHAR(255),
      irrigationSource VARCHAR(255),
      waterAvailability VARCHAR(255),
      annualIncome FLOAT,
      category VARCHAR(255),
      currentCrops TEXT,
      previousCrops TEXT,
      farmingExperience INT,
      preferredLanguage VARCHAR(255) DEFAULT 'English',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  // Farms table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS farms (
      _id VARCHAR(255) PRIMARY KEY,
      user VARCHAR(255) NOT NULL,
      name VARCHAR(255) DEFAULT 'My Farm Twin',
      boundaries TEXT,
      soilProfile TEXT,
      waterMetrics TEXT,
      cropStatus TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  // Produces table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS produces (
      _id VARCHAR(255) PRIMARY KEY,
      user VARCHAR(255) NOT NULL,
      cropName VARCHAR(255) NOT NULL,
      quantity FLOAT NOT NULL,
      grade VARCHAR(255),
      estimatedPrice FLOAT,
      harvestDate DATETIME,
      status VARCHAR(255) DEFAULT 'Listing',
      buyer VARCHAR(255),
      location TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  // Schemes table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schemes (
      _id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      state VARCHAR(255),
      maxLandSize FLOAT,
      minLandSize FLOAT,
      allowedCategories TEXT,
      minFarmingExperience INT,
      benefits TEXT,
      requiredDocuments TEXT,
      deadline DATETIME,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  // Alerts table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS alerts (
      _id VARCHAR(255) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(255) DEFAULT 'Weather',
      severity VARCHAR(255) DEFAULT 'Medium',
      state VARCHAR(255),
      district VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  // Documents table (Kissan Secure Vault)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS documents (
      _id VARCHAR(255) PRIMARY KEY,
      user VARCHAR(255) NOT NULL,
      category VARCHAR(255),
      documentType VARCHAR(255),
      documentNumber VARCHAR(255),
      extractedMetadata TEXT,
      encryptedUrl LONGTEXT,
      format VARCHAR(50) DEFAULT 'Image',
      issueDate DATETIME,
      expiryDate DATETIME,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);

  // Force modify existing column to LONGTEXT if table already exists
  await pool.query(`
    ALTER TABLE documents MODIFY COLUMN encryptedUrl LONGTEXT;
  `);

  // Try adding format column in case table already exists from previous runs
  try {
    await pool.query(`
      ALTER TABLE documents ADD COLUMN format VARCHAR(50) DEFAULT 'Image';
    `);
  } catch (err) {
    // Ignore error if column already exists
  }

  console.log('[MySQL] Tables verified/created.');
};

const seedData = async () => {
  // Check if users empty
  const [userCount] = await pool.query('SELECT COUNT(*) as count FROM users');
  if (userCount[0].count === 0) {
    console.log('[MySQL] Seeding initial mock users...');
    for (const user of INITIAL_USERS) {
      await pool.query(
        'INSERT INTO users (_id, name, phone, password, village, district, state, gpsLocation, landArea, landOwnership, soilType, irrigationSource, waterAvailability, annualIncome, category, currentCrops, previousCrops, farmingExperience, preferredLanguage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [user._id, user.name, user.phone, user.password, user.village, user.district, user.state, user.gpsLocation, user.landArea, user.landOwnership, user.soilType, user.irrigationSource, user.waterAvailability, user.annualIncome, user.category, user.currentCrops, user.previousCrops, user.farmingExperience, user.preferredLanguage]
      );
    }
  }

  // Check if farms empty
  const [farmCount] = await pool.query('SELECT COUNT(*) as count FROM farms');
  if (farmCount[0].count === 0) {
    console.log('[MySQL] Seeding initial mock farms...');
    for (const farm of INITIAL_FARMS) {
      await pool.query(
        'INSERT INTO farms (_id, user, name, boundaries, soilProfile, waterMetrics, cropStatus) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [farm._id, farm.user, farm.name, farm.boundaries, farm.soilProfile, farm.waterMetrics, farm.cropStatus]
      );
    }
  }

  // Check if produces empty
  const [produceCount] = await pool.query('SELECT COUNT(*) as count FROM produces');
  if (produceCount[0].count === 0) {
    console.log('[MySQL] Seeding initial mock produce listings...');
    for (const p of INITIAL_PRODUCES) {
      await pool.query(
        'INSERT INTO produces (_id, user, cropName, quantity, grade, estimatedPrice, harvestDate, status, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [p._id, p.user, p.cropName, p.quantity, p.grade, p.estimatedPrice, p.harvestDate, p.status, p.location]
      );
    }
  }

  // Check if schemes empty
  const [schemeCount] = await pool.query('SELECT COUNT(*) as count FROM schemes');
  if (schemeCount[0].count === 0) {
    console.log('[MySQL] Seeding initial mock schemes...');
    for (const s of INITIAL_SCHEMES) {
      await pool.query(
        'INSERT INTO schemes (_id, name, description, state, maxLandSize, minLandSize, allowedCategories, minFarmingExperience, benefits, requiredDocuments, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [s._id, s.name, s.description, s.state, s.maxLandSize, s.minLandSize, s.allowedCategories, s.minFarmingExperience, s.benefits, s.requiredDocuments, s.deadline]
      );
    }
  }

  console.log('[MySQL] Seed data initialization checked.');
};
