const phonemeMap: Record<string, string> = {
  'a': 'æ',
  'e': 'e',
  'i': 'ɪ',
  'o': 'ɒ',
  'u': 'ʌ',
  'th': 'θ',
  'sh': 'ʃ',
  'ch': 'tʃ',
  'ng': 'ŋ',
  'er': 'ɜː',
  'ar': 'ɑː',
  'or': 'ɔː',
  'oo': 'uː',
  'ee': 'iː',
  'ay': 'eɪ',
  'ow': 'aʊ',
  'oy': 'ɔɪ'
};

const stressPatterns: Record<string, string> = {
  'help': 'help',
  'coming': 'ˈkʌmɪŋ',
  'safe': 'seɪf',
  'calm': 'kɑːm',
  'follow': 'ˈfɒləʊ',
  'move': 'muːv',
  'hurt': 'hɜːrt',
  'allergies': 'ˈælədʒiz',
  'medication': 'ˌmɛdɪˈkeɪʃən',
  'breathe': 'briːð',
  'ambulance': 'ˈæmbjʊləns',
  'exit': 'ˈɛɡzɪt',
  'dangerous': 'ˈdeɪndʒərəs',
  'essentials': 'ɪˈsɛnʃəlz',
  'gather': 'ˈɡæðər',
  'understand': 'ˌʌndəˈstænd',
  'okay': 'ˌəʊˈkeɪ',
  'emergency': 'ɪˈmɜːrdʒənsi',
  'rescue': 'ˈrɛskjuː',
  'evacuate': 'ɪˈvækjueɪt',
  'shelter': 'ˈʃɛltər',
  'water': 'ˈwɔːtər',
  'food': 'fuːd',
  'injury': 'ˈɪndʒəri',
  'hospital': 'ˈhɒspɪtəl',
  'doctor': 'ˈdɒktər'
};

export function generateTranscription(englishText: string): string {
  const cleaned = englishText.toLowerCase().trim();
  
  if (!cleaned) {
    return '';
  }

  const words = cleaned.split(/\s+/);
  const transcribed = words.map(word => {
    const cleanWord = word.replace(/[^\w\s]/g, '');
    
    if (stressPatterns[cleanWord]) {
      return stressPatterns[cleanWord];
    }
    
    let result = cleanWord;
    
    const patterns = Object.keys(phonemeMap).sort((a, b) => b.length - a.length);
    patterns.forEach(pattern => {
      const regex = new RegExp(pattern, 'g');
      result = result.replace(regex, phonemeMap[pattern]);
    });
    
    if (cleanWord.length > 5) {
      result = 'ˈ' + result;
    }
    
    return result;
  });

  return `[${transcribed.join(' ')}]`;
}

export function generateTranscriptionWithAPI(text: string): Promise<string> {
  return new Promise((resolve) => {
    const transcription = generateTranscription(text);
    
    setTimeout(() => {
      resolve(transcription);
    }, 300);
  });
}
