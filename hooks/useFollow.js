import { useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';

export function useFollow(merchantId, initial = false) {
  const { data: session }       = useSession();
  const [following, setFollowing] = useState(initial);
  const [loading, setLoading]     = useState(false);

  async function toggleFollow() {
    if (!session) { toast.error('Connectez-vous pour suivre un commerçant'); return; }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/follows', { merchantId });
      setFollowing(data.following);
      toast.success(data.following ? 'Abonné !' : 'Désabonné');
    } catch {
      toast.error('Erreur');
    } finally {
      setLoading(false);
    }
  }

  return { following, loading, toggleFollow };
}
