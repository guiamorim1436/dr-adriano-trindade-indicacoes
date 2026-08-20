# Implementation Plan - Reward System

Implement a point redemption system where each converted referral equals 1 point. Admins can redeem these points for prizes.

## Proposed Changes

### Database
- Create `public.premios` table to track redemptions:
    - `id`: UUID (PK)
    - `indicador_id`: UUID (FK to indicadores)
    - `pontos_consumidos`: Integer (points deducted)
    - `comentario`: Text (prize description)
    - `created_at`: Timestamp
- Add necessary RLS policies and grants.

### Backend (Edge Functions)
- Update `admin-api`:
    - Add `premiarIndicador` action to record redemptions.
    - Update `listarIndicadores` action to return `pontos_consumidos` (total points already redeemed) so the frontend can calculate the current balance.

### Frontend
- **API**: Add `premiarIndicador` function in `src/lib/api.ts`.
- **UI**: Update `src/pages/AdminIndicadores.tsx`:
    - Display current point balance.
    - Add a "Premiar" button that enables when the balance is > 0.
    - Add a redemption dialog to specify points and add a comment.

## Technical Details

### SQL Migration
```sql
CREATE TABLE public.premios (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    indicador_id uuid REFERENCES public.indicadores(id) ON DELETE CASCADE NOT NULL,
    pontos_consumidos integer NOT NULL CHECK (pontos_consumidos > 0),
    comentario text,
    created_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT ON public.premios TO authenticated;
GRANT ALL ON public.premios TO service_role;

ALTER TABLE public.premios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage premios" 
ON public.premios 
FOR ALL 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));
```
