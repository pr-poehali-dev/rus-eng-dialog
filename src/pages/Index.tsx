import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { defaultPhrases, categories, Phrase } from '@/data/phrases';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { generateTranscriptionWithAPI } from '@/utils/transcription';
import { toast } from 'sonner';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useLocalStorage<string>('rescue-talk-category', 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customPhrases, setCustomPhrases] = useLocalStorage<Phrase[]>('rescue-talk-custom-phrases', []);
  const [newPhrase, setNewPhrase] = useState({ russian: '', english: '', transcription: '' });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [phraseToDelete, setPhraseToDelete] = useState<Phrase | null>(null);
  const [isGeneratingTranscription, setIsGeneratingTranscription] = useState(false);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (!isOnline) {
      toast.info('Офлайн-режим: данные сохранены локально');
    }
  }, [isOnline]);

  const allPhrases = useMemo(() => {
    return [...defaultPhrases, ...customPhrases];
  }, [customPhrases]);

  const filteredPhrases = useMemo(() => {
    let phrases = allPhrases;
    
    if (selectedCategory !== 'all') {
      phrases = phrases.filter(p => p.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      phrases = phrases.filter(p => 
        p.russian.toLowerCase().includes(query) || 
        p.english.toLowerCase().includes(query)
      );
    }
    
    return phrases;
  }, [allPhrases, selectedCategory, searchQuery]);

  const speakPhrase = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      toast.success('Воспроизведение фразы');
    } else {
      toast.error('Озвучивание недоступно в этом браузере');
    }
  };

  const handleAddPhrase = () => {
    if (!newPhrase.russian || !newPhrase.english || !newPhrase.transcription) {
      toast.error('Заполните все поля');
      return;
    }

    const phrase: Phrase = {
      id: `custom-${Date.now()}`,
      ...newPhrase,
      category: 'custom'
    };

    setCustomPhrases([...customPhrases, phrase]);
    setNewPhrase({ russian: '', english: '', transcription: '' });
    setIsAddDialogOpen(false);
    toast.success('Фраза добавлена и сохранена локально');
  };

  const handleDeletePhrase = (phraseId: string) => {
    setCustomPhrases(customPhrases.filter(p => p.id !== phraseId));
    setPhraseToDelete(null);
    toast.success('Фраза удалена');
  };

  const isCustomPhrase = (phrase: Phrase) => phrase.id.startsWith('custom-');

  const handleEnglishChange = async (value: string) => {
    setNewPhrase({ ...newPhrase, english: value });
    
    if (value.length > 2) {
      setIsGeneratingTranscription(true);
      try {
        const transcription = await generateTranscriptionWithAPI(value);
        setNewPhrase(prev => ({ ...prev, transcription }));
      } catch (error) {
        console.error('Error generating transcription:', error);
      } finally {
        setIsGeneratingTranscription(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-accent">
      <div className="container max-w-6xl mx-auto p-4 pb-20">
        <header className="py-6 mb-8">
          {!isOnline && (
            <Alert className="mb-4 bg-accent/20 border-accent">
              <Icon name="WifiOff" className="h-4 w-4" />
              <AlertDescription className="font-semibold">
                Офлайн-режим: все данные сохранены на устройстве
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-destructive rounded-lg flex items-center justify-center">
                <Icon name="Shield" className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">RescueTalk</h1>
                <p className="text-white/80 text-sm font-medium">Разговорник для спасателей</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-primary hover:bg-white/90 font-bold shadow-lg">
                  <Icon name="Plus" size={20} className="mr-2" />
                  Добавить
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Добавить новую фразу</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="russian" className="font-bold">Русский текст</Label>
                    <Input
                      id="russian"
                      value={newPhrase.russian}
                      onChange={(e) => setNewPhrase({ ...newPhrase, russian: e.target.value })}
                      placeholder="Введите фразу на русском"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="english" className="font-bold">Английский перевод</Label>
                    <Input
                      id="english"
                      value={newPhrase.english}
                      onChange={(e) => handleEnglishChange(e.target.value)}
                      placeholder="Enter English translation"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="transcription" className="font-bold flex items-center gap-2">
                      Транскрипция
                      {isGeneratingTranscription && (
                        <span className="text-xs text-muted-foreground font-normal">(генерируется...)</span>
                      )}
                    </Label>
                    <Input
                      id="transcription"
                      value={newPhrase.transcription}
                      onChange={(e) => setNewPhrase({ ...newPhrase, transcription: e.target.value })}
                      placeholder="[trænˈskrɪpʃən]"
                      className="mt-2"
                      disabled={isGeneratingTranscription}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Автоматически генерируется при вводе английского текста
                    </p>
                  </div>
                  <Button onClick={handleAddPhrase} className="w-full font-bold" size="lg">
                    Сохранить фразу
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="search"
              placeholder="Поиск по фразам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base bg-white/95 border-0 shadow-lg font-medium"
            />
          </div>
        </header>

        <div className="mb-6 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex gap-2 min-w-max">
            <Button
              onClick={() => setSelectedCategory('all')}
              variant={selectedCategory === 'all' ? 'default' : 'secondary'}
              className="font-bold shadow-md whitespace-nowrap"
              size="lg"
            >
              <Icon name="Grid" size={20} className="mr-2" />
              Все фразы
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                variant={selectedCategory === cat.id ? 'default' : 'secondary'}
                className={`font-bold shadow-md whitespace-nowrap ${
                  selectedCategory === cat.id ? cat.color + ' text-white hover:opacity-90' : ''
                }`}
                size="lg"
              >
                <Icon name={cat.icon as any} size={20} className="mr-2" />
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPhrases.map((phrase) => {
            const category = categories.find(c => c.id === phrase.category);
            return (
              <Card key={phrase.id} className="hover:shadow-xl transition-shadow duration-200 border-2">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`${category?.color || 'bg-primary'} text-white font-bold`}>
                      {category?.name || 'Другое'}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => speakPhrase(phrase.english)}
                        className="h-8 w-8 p-0 hover:bg-accent hover:text-white"
                      >
                        <Icon name="Volume2" size={18} />
                      </Button>
                      {isCustomPhrase(phrase) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPhraseToDelete(phrase)}
                          className="h-8 w-8 p-0 hover:bg-destructive hover:text-white"
                        >
                          <Icon name="Trash2" size={18} />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-lg font-bold text-primary leading-tight">
                        {phrase.russian}
                      </p>
                    </div>
                    
                    <div className="border-t pt-3">
                      <p className="text-base font-semibold text-foreground mb-1">
                        {phrase.english}
                      </p>
                      <p className="text-sm text-muted-foreground font-medium">
                        {phrase.transcription}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredPhrases.length === 0 && (
          <div className="text-center py-16">
            <Icon name="SearchX" size={64} className="mx-auto mb-4 text-white/50" />
            <p className="text-white text-xl font-bold">Фразы не найдены</p>
            <p className="text-white/70 mt-2">Попробуйте изменить поисковый запрос</p>
          </div>
        )}
      </div>

      <AlertDialog open={!!phraseToDelete} onOpenChange={() => setPhraseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold">Удалить фразу?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Вы уверены, что хотите удалить фразу <strong>"{phraseToDelete?.russian}"</strong>? 
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-bold">Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => phraseToDelete && handleDeletePhrase(phraseToDelete.id)}
              className="bg-destructive hover:bg-destructive/90 font-bold"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;