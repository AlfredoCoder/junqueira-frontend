import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Container from '@/components/layout/Container';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute redirectTo="/">
      <Container>
        {children}
      </Container>
    </ProtectedRoute>
  );
}