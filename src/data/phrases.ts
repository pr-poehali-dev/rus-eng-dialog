export interface Phrase {
  id: string;
  russian: string;
  english: string;
  transcription: string;
  category: string;
}

export const categories = [
  { id: 'emergency', name: 'Экстренные фразы', icon: 'AlertCircle', color: 'bg-destructive' },
  { id: 'medical', name: 'Медицинские термины', icon: 'Heart', color: 'bg-red-500' },
  { id: 'evacuation', name: 'Эвакуация и безопасность', icon: 'Shield', color: 'bg-accent' },
  { id: 'basic', name: 'Базовые фразы общения', icon: 'MessageCircle', color: 'bg-primary' },
  { id: 'custom', name: 'Мои добавленные слова', icon: 'Plus', color: 'bg-secondary' },
];

export const defaultPhrases: Phrase[] = [
  {
    id: '1',
    russian: 'Помощь идёт',
    english: 'Help is coming',
    transcription: '[help ɪz ˈkʌmɪŋ]',
    category: 'emergency'
  },
  {
    id: '2',
    russian: 'Вы в безопасности',
    english: 'You are safe',
    transcription: '[juː ɑːr seɪf]',
    category: 'emergency'
  },
  {
    id: '3',
    russian: 'Оставайтесь спокойны',
    english: 'Stay calm',
    transcription: '[steɪ kɑːm]',
    category: 'emergency'
  },
  {
    id: '4',
    russian: 'Следуйте за мной',
    english: 'Follow me',
    transcription: '[ˈfɒləʊ miː]',
    category: 'emergency'
  },
  {
    id: '5',
    russian: 'Не двигайтесь',
    english: 'Don\'t move',
    transcription: '[dəʊnt muːv]',
    category: 'emergency'
  },
  {
    id: '6',
    russian: 'Где болит?',
    english: 'Where does it hurt?',
    transcription: '[weər dʌz ɪt hɜːrt]',
    category: 'medical'
  },
  {
    id: '7',
    russian: 'У вас аллергия?',
    english: 'Do you have allergies?',
    transcription: '[duː juː hæv ˈælədʒiz]',
    category: 'medical'
  },
  {
    id: '8',
    russian: 'Принимаете ли вы лекарства?',
    english: 'Are you taking any medication?',
    transcription: '[ɑːr juː ˈteɪkɪŋ ˈɛni ˌmɛdɪˈkeɪʃən]',
    category: 'medical'
  },
  {
    id: '9',
    russian: 'Можете дышать?',
    english: 'Can you breathe?',
    transcription: '[kæn juː briːð]',
    category: 'medical'
  },
  {
    id: '10',
    russian: 'Скорая помощь в пути',
    english: 'Ambulance is on the way',
    transcription: '[ˈæmbjʊləns ɪz ɒn ðə weɪ]',
    category: 'medical'
  },
  {
    id: '11',
    russian: 'Идите к выходу',
    english: 'Go to the exit',
    transcription: '[ɡəʊ tuː ði ˈɛɡzɪt]',
    category: 'evacuation'
  },
  {
    id: '12',
    russian: 'Здесь опасно',
    english: 'It\'s dangerous here',
    transcription: '[ɪts ˈdeɪndʒərəs hɪər]',
    category: 'evacuation'
  },
  {
    id: '13',
    russian: 'Берите самое необходимое',
    english: 'Take only essentials',
    transcription: '[teɪk ˈəʊnli ɪˈsɛnʃəlz]',
    category: 'evacuation'
  },
  {
    id: '14',
    russian: 'Собирайтесь здесь',
    english: 'Gather here',
    transcription: '[ˈɡæðər hɪər]',
    category: 'evacuation'
  },
  {
    id: '15',
    russian: 'Не возвращайтесь назад',
    english: 'Don\'t go back',
    transcription: '[dəʊnt ɡəʊ bæk]',
    category: 'evacuation'
  },
  {
    id: '16',
    russian: 'Как вас зовут?',
    english: 'What\'s your name?',
    transcription: '[wɒts jɔːr neɪm]',
    category: 'basic'
  },
  {
    id: '17',
    russian: 'Вы понимаете меня?',
    english: 'Do you understand me?',
    transcription: '[duː juː ˌʌndəˈstænd miː]',
    category: 'basic'
  },
  {
    id: '18',
    russian: 'Вам нужна помощь?',
    english: 'Do you need help?',
    transcription: '[duː juː niːd hɛlp]',
    category: 'basic'
  },
  {
    id: '19',
    russian: 'Где вы?',
    english: 'Where are you?',
    transcription: '[weər ɑːr juː]',
    category: 'basic'
  },
  {
    id: '20',
    russian: 'Всё будет хорошо',
    english: 'Everything will be okay',
    transcription: '[ˈɛvrɪθɪŋ wɪl biː ˌəʊˈkeɪ]',
    category: 'basic'
  },
];
