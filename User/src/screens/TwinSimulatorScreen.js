import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { Sliders } from 'lucide-react-native';
import { THEME } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';
import GlassCard from '../components/GlassCard';
import { API_BASE_URL } from '../config/api';

export default function TwinSimulatorScreen() {
  const { farmerProfile } = useProfile();
  
  const [simCrop, setSimCrop] = useState('Paddy');
  const [rainVar, setRainVar] = useState(0); // percentage rainfall variation
  const [irrFreq, setIrrFreq] = useState(3); // times per week
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);

  const triggerSimulation = async () => {
    setSimulating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/farm/simulate/${farmerProfile?._id || 'default_user'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: simCrop,
          rainfallVariation: rainVar,
          irrigationFrequency: irrFreq,
          landArea: farmerProfile?.landArea || 2.5
        })
      });
      const result = await response.json();
      if (result.status === 'success') {
        setSimResult(result.data.simulation);
      } else {
        throw new Error('Simulation failed');
      }
    } catch (e) {
      // Fallback local simulation
      let baseYield = 4.2; // Tons/acre
      let baseProfit = 31000; // Rs/acre
      let baseWater = 1350; // mm
      let suit = 85;
      let risk = 20;

      if (simCrop === 'Maize') {
        baseYield = 3.5;
        baseProfit = 22000;
        baseWater = 600;
        suit = 92;
        risk = 15;
      } else if (simCrop === 'Wheat') {
        baseYield = 3.8;
        baseProfit = 26000;
        baseWater = 500;
        suit = 88;
        risk = 18;
      } else if (simCrop === 'Tomato') {
        baseYield = 12.0;
        baseProfit = 75000;
        baseWater = 700;
        suit = 72;
        risk = 45;
      }

      // Apply rain variation impact
      if (rainVar < 0) {
        const impact = Math.abs(rainVar) * 0.007;
        baseYield *= (1 - impact);
        baseProfit *= (1 - impact * 1.5);
        risk += Math.abs(rainVar) * 0.6;
      } else if (rainVar > 0) {
        baseYield *= (1 + rainVar * 0.002);
      }

      // Apply irrigation frequency impact
      if (irrFreq < 3) {
        baseWater -= (3 - irrFreq) * 150;
        baseYield *= 0.93;
        baseProfit *= 0.91;
      } else if (irrFreq > 3) {
        baseWater += (irrFreq - 3) * 120;
        baseYield *= 1.02;
        baseProfit -= (irrFreq - 3) * 600;
      }

      const acres = Number(farmerProfile?.landArea) || 2.5;

      setSimResult({
        yield: `${baseYield.toFixed(2)} Tons/Acre`,
        totalYield: `${(baseYield * acres).toFixed(1)} Tons`,
        water: `${Math.round(baseWater)} mm`,
        investment: `₹${Math.round(12000 * acres).toLocaleString('en-IN')}`,
        profit: `₹${Math.round(baseProfit * acres).toLocaleString('en-IN')}`,
        suitability: `${Math.min(100, suit)}%`,
        risk: `${Math.min(100, Math.round(risk))}%`
      });
    } finally {
      setSimulating(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.screenHeader}>
        <Sliders size={24} color={THEME.primary} />
        <Text style={styles.screenTitle}>AI Farm Digital Twin Simulator</Text>
      </View>
      <Text style={styles.screenIntro}>
        Simulate farming decisions and test variations in climate/irrigation before making investments.
      </Text>

      <GlassCard>
        <Text style={styles.configLabel}>1. Select Simulated Crop Swap</Text>
        <View style={styles.cropSelector}>
          {['Paddy', 'Maize', 'Wheat', 'Tomato'].map(crop => (
            <TouchableOpacity 
              key={crop} 
              style={[styles.cropOption, simCrop === crop && styles.cropOptionSelected]}
              onPress={() => setSimCrop(crop)}
            >
              <Text style={[styles.cropOptionText, simCrop === crop && styles.cropOptionTextSelected]}>{crop}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.configLabel}>2. Rainfall Deviation ({rainVar}%)</Text>
        <View style={styles.sliderRow}>
          {[-30, -15, 0, 15, 30].map(val => (
            <TouchableOpacity 
              key={val} 
              style={[styles.sliderTick, rainVar === val && styles.sliderTickSelected]}
              onPress={() => setRainVar(val)}
            >
              <Text style={[styles.sliderTickText, rainVar === val && styles.sliderTickTextSelected]}>
                {val > 0 ? `+${val}%` : `${val}%`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.configLabel}>3. Irrigation Frequency ({irrFreq}x per week)</Text>
        <View style={styles.sliderRow}>
          {[1, 2, 3, 4, 5].map(val => (
            <TouchableOpacity 
              key={val} 
              style={[styles.sliderTick, irrFreq === val && styles.sliderTickSelected]}
              onPress={() => setIrrFreq(val)}
            >
              <Text style={[styles.sliderTickText, irrFreq === val && styles.sliderTickTextSelected]}>
                {val}x/wk
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.runSimBtn} onPress={triggerSimulation}>
          <Text style={styles.runSimBtnText}>Run Decisions Simulation</Text>
        </TouchableOpacity>
      </GlassCard>

      {simulating && (
        <View style={{ marginVertical: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={THEME.primary} />
          <Text style={{ marginTop: 8, color: THEME.textMuted }}>Running soil profile algorithms...</Text>
        </View>
      )}

      {simResult && !simulating && (
        <GlassCard style={{ marginTop: 16, borderColor: THEME.lightGreen }}>
          <Text style={styles.simResultsHeader}>Simulation Report Metrics</Text>
          
          <View style={styles.simResultsRow}>
            <Text style={styles.simResLabel}>Expected Crop Yield</Text>
            <Text style={styles.simResVal}>{simResult.yield} ({simResult.totalYield})</Text>
          </View>

          <View style={styles.simResultsRow}>
            <Text style={styles.simResLabel}>Water Requirement</Text>
            <Text style={styles.simResVal}>{simResult.water}</Text>
          </View>

          <View style={styles.simResultsRow}>
            <Text style={styles.simResLabel}>Est. Sowing Cost</Text>
            <Text style={styles.simResVal}>{simResult.investment}</Text>
          </View>

          <View style={styles.simResultsRow}>
            <Text style={styles.simResLabel}>Expected Net Profit</Text>
            <Text style={[styles.simResVal, { color: THEME.primary, fontWeight: '800' }]}>{simResult.profit}</Text>
          </View>

          <View style={styles.simResultsRow}>
            <Text style={styles.simResLabel}>Suitability Index</Text>
            <Text style={styles.simResVal}>{simResult.suitability}</Text>
          </View>

          <View style={styles.simResultsRow}>
            <Text style={styles.simResLabel}>Crop Risk Factor</Text>
            <Text style={[styles.simResVal, { color: Number(simResult.risk.replace('%','')) > 30 ? THEME.goldenCrop : THEME.primary }]}>
              {simResult.risk}
            </Text>
          </View>
        </GlassCard>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 90
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.deepForest
  },
  screenIntro: {
    fontSize: 12,
    color: THEME.textMuted,
    lineHeight: 16,
    marginBottom: 20
  },
  configLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.deepForest,
    marginTop: 14,
    marginBottom: 10
  },
  cropSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8
  },
  cropOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8eae3',
    alignItems: 'center',
    backgroundColor: THEME.bg
  },
  cropOptionSelected: {
    borderColor: THEME.primary,
    backgroundColor: 'rgba(76, 175, 80, 0.08)'
  },
  cropOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.textMuted
  },
  cropOptionTextSelected: {
    color: THEME.primary
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6
  },
  sliderTick: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e8eae3',
    alignItems: 'center',
    backgroundColor: THEME.bg
  },
  sliderTickSelected: {
    borderColor: THEME.primary,
    backgroundColor: 'rgba(76, 175, 80, 0.08)'
  },
  sliderTickText: {
    fontSize: 11,
    color: THEME.textMuted
  },
  sliderTickTextSelected: {
    color: THEME.primary,
    fontWeight: '700'
  },
  runSimBtn: {
    marginTop: 20,
    backgroundColor: THEME.primary,
    padding: 14,
    borderRadius: 50,
    alignItems: 'center'
  },
  runSimBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14
  },
  simResultsHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: THEME.deepForest,
    borderBottomWidth: 1,
    borderColor: '#e8eae3',
    paddingBottom: 10,
    marginBottom: 10
  },
  simResultsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6
  },
  simResLabel: {
    fontSize: 12,
    color: THEME.textMuted
  },
  simResVal: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.deepForest
  }
});
