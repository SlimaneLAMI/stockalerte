import { useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';

export function useFavorite(offerId, initial = false) {
  const { data: session }     = useSession();
  const [favorited, setFavorited] = useState(initial);
  const [loading, setLoading]     = useState(false);

  async function toggleFavorite() {
    if (!session) { toast.error('Connectez-vous pour ajouter aux favoris'); return; }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/favorites', { offerId });
      setFavorited(data.favorited);
      toast.success(data.favorited ? 'Ajouté aux favoris' : 'Retiré des favoris');
    } catch {
      toast.error('Erreur');
    } finally {
      setLoading(false);
    }
  }

  return { favorited, loading, toggleFavorite };
}
