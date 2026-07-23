import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../context/ThemeContext';

export default function PillButton({ title, onPress, style, textStyle, icon }) {
  return (
    <TouchableOpacity style={[styles.btn, style]} onPress={onPress} activeOpacity={0.85}>
      {icon}
      <Text style={[styles.btnText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: THEME.primary,
    borderRadius: 50,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700'
  }
});
