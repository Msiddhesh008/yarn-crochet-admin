import { HashRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CatalogProvider } from './context/CatalogContext'
import { AdminShell } from './components/AdminShell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { OverviewPage } from './pages/OverviewPage'
import { ProductsPage } from './pages/ProductsPage'
import { ProductFormPage } from './pages/ProductFormPage'
import { OrdersPage } from './pages/OrdersPage'
import { OrderDetailPage } from './pages/OrderDetailPage'
import { ContentPage } from './pages/ContentPage'
import { CustomRequestsPage } from './pages/CustomRequestsPage'
import { CustomersPage } from './pages/CustomersPage'
import { CustomerDetailPage } from './pages/CustomerDetailPage'
import { ApiHealthPage } from './pages/ApiHealthPage'
import { GalleryPage } from './pages/GalleryPage'

function ProductFormRoute() {
  const { id } = useParams()
  return <ProductFormPage key={id ?? 'new'} />
}

export default function App() {
  return (
    <AuthProvider>
      <CatalogProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminShell />}>
                <Route index element={<OverviewPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/new" element={<ProductFormPage key="new" />} />
                <Route path="products/:id" element={<ProductFormRoute />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/:id" element={<OrderDetailPage />} />
                <Route path="customers" element={<CustomersPage />} />
                <Route path="customers/:id" element={<CustomerDetailPage />} />
                <Route path="content" element={<ContentPage />} />
                <Route path="gallery" element={<GalleryPage />} />
                <Route path="custom-requests" element={<CustomRequestsPage />} />
                <Route path="api-health" element={<ApiHealthPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </CatalogProvider>
    </AuthProvider>
  )
}
