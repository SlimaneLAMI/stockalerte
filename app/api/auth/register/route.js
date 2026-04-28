import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { apiError, apiResponse } from '@/lib/utils';

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) return apiError('Champs obligatoires manquants', 400);
    if (password.length < 6) return apiError('Mot de passe trop court (min 6 caractères)', 400);
    if (!['client', 'merchant'].includes(role)) return apiError('Rôle invalide', 400);

    await connectDB();
    const existing = await User.findOne({ email });
    if (existing) return apiError('Cet email est déjà utilisé', 409);

    const user = await User.create({ name, email, password, role, isVerified: false });

    return apiResponse({
      message: 'Compte créé avec succès',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    }, 201);
  } catch (err) {
    console.error('[REGISTER]', err);
    return apiError('Erreur serveur', 500);
  }
}
