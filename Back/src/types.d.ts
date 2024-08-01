// types.d.ts
import { User } from '@prisma/client'; // Ajuste o import conforme necessário

declare global {
  namespace Express {
    interface Request {
      user?: User; // Ou defina um tipo específico para o usuário
    }
  }
}
