import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export interface AISolutionResponse {
  success: boolean;
  source: 'gemini' | 'rule-engine';
  recommendation: string;
  recommendedServices: string[];
  suggestedSafetyLevel: string;
  keyConsiderations: string[];
}

/**
 * Server-side AI automation solution advisor.
 * Analyzes industrial requirements and suggests tailored engineering architectures.
 */
export async function generateAutomationAdvice(
  userQuery: string,
  industry?: string,
  plantType?: string
): Promise<AISolutionResponse> {
  const truncatedQuery = userQuery.slice(0, 1000).trim();
  const contextIndustry = (industry || 'Industrial Manufacturing').slice(0, 100);
  const contextPlant = (plantType || 'Continuous Process Plant').slice(0, 100);

  const ai = getAIClient();

  if (!ai) {
    // Graceful fallback when GEMINI_API_KEY is not configured
    return getFallbackRecommendation(truncatedQuery, contextIndustry);
  }

  try {
    const prompt = `You are an elite Industrial Automation & Process Engineering Consultant for AMM Automation (an industrial turnkey solutions provider specializing in PLC/SCADA, HT/LT Motors, Process Instrumentation, AMR Robotics, and Safety-Instrumented Systems SIL-2/3).

Evaluate the following plant automation query:
- Target Industry: ${contextIndustry}
- Plant Type: ${contextPlant}
- Specific Requirement: "${truncatedQuery}"

Provide a concise, practical technical recommendation in JSON format with these exact keys:
1. "recommendation": A direct 2-3 paragraph technical architecture proposal detailing hardware (PLC/SCADA/VFD/Sensors) and operational methodology.
2. "recommendedServices": Array of 2 to 4 key service categories from (Electrical Solutions, Industrial Automation Solutions, Process Instruments, Industrial Safety Solutions, Robotics & Smart Plant, Smart Industry 4.0).
3. "suggestedSafetyLevel": E.g., "SIL-2 / Category 3 PL-d" or "Standard Industrial Interlocking".
4. "keyConsiderations": Array of 3 to 5 critical operational points (e.g. ambient temperature, fail-safe redundancy, explosion-proofing, dynamic balancing).

Output ONLY valid JSON.`;

    // Timeout guard: 8 seconds maximum
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI Request timed out')), 8000)
    );

    const apiCallPromise = ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const response = await Promise.race([apiCallPromise, timeoutPromise]);
    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    return {
      success: true,
      source: 'gemini',
      recommendation: parsed.recommendation || 'AMM Automation recommends customized PLC/SCADA supervisory integration with calibrated instrumentation.',
      recommendedServices: Array.isArray(parsed.recommendedServices) ? parsed.recommendedServices : ['Industrial Automation Solutions'],
      suggestedSafetyLevel: parsed.suggestedSafetyLevel || 'SIL-2 Compliance',
      keyConsiderations: Array.isArray(parsed.keyConsiderations) ? parsed.keyConsiderations : ['Fail-safe interlocks', 'Environmental dust rating', 'Vibration monitoring']
    };
  } catch (err: any) {
    console.warn('[Gemini Service] AI evaluation failed or timed out, degrading gracefully:', err?.message || err);
    return getFallbackRecommendation(truncatedQuery, contextIndustry);
  }
}

function getFallbackRecommendation(query: string, industry: string): AISolutionResponse {
  const lower = query.toLowerCase();

  let recommendedServices = ['Industrial Automation Solutions', 'Process Instruments'];
  let safetyLevel = 'SIL-2 / Standard Industrial Interlocking';
  let considerations = [
    'Dual-channel emergency stop circuit & safety relay integration',
    'IP65/IP66 enclosure protection for hostile ambient dust/temperature',
    'High-resolution 4-20mA HART transmitter calibration',
    'Uninterrupted 24VDC control supply with battery backup'
  ];

  if (lower.includes('motor') || lower.includes('pump') || lower.includes('rewind') || lower.includes('vfd')) {
    recommendedServices = ['Electrical Solutions', 'Industrial Automation Solutions'];
    safetyLevel = 'Class F/H Thermal Protection & Phase Reversal Interlock';
    considerations = [
      'Precision dynamic rotor balancing under ISO 1940 standards',
      'VPI (Vacuum Pressure Impregnation) insulation for extended lifespan',
      'Variable Frequency Drive harmonic filtering and dV/dt choke integration'
    ];
  } else if (lower.includes('robot') || lower.includes('amr') || lower.includes('agv') || lower.includes('warehouse')) {
    recommendedServices = ['Robotics & Smart Plant', 'Smart Industry 4.0'];
    safetyLevel = 'Category 4 / PL-e Optical Lidar Protection';
    considerations = [
      'Safety laser scanners with dynamic slowdown field zones',
      'Fleet manager coordination with existing plant MES/ERP',
      'Autonomous magnetic/natural navigation route mapping'
    ];
  } else if (lower.includes('safety') || lower.includes('loto') || lower.includes('burner') || lower.includes('boiler')) {
    recommendedServices = ['Industrial Safety Solutions', 'Process Instruments'];
    safetyLevel = 'SIL-3 Safety Instrumented System (SIS)';
    considerations = [
      '1oo2 or 2oo3 voting logic on critical flame and pressure transmitters',
      'Automated fail-safe fuel shut-off valves with proof of closure',
      'LOTO (Lockout/Tagout) physical and software access control'
    ];
  }

  return {
    success: true,
    source: 'rule-engine',
    recommendation: `Based on your requirements for ${industry}, AMM Automation advises deploying an integrated architecture featuring high-reliability industrial field hardware, calibrated sensor telemetry, and modular PLC controllers programmed with deterministic scan cycles. Our engineering team can conduct an on-site audit to specify exact sensor part numbers, I/O distribution, and control panel schematics.`,
    recommendedServices,
    suggestedSafetyLevel: safetyLevel,
    keyConsiderations: considerations
  };
}
