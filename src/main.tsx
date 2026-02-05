import React from 'react'
import ReactDOM from 'react-dom/client'
import { SalesDataProvider } from './contexts/SalesDataContext'
import SalesDashboardApp from './SalesDashboardApp.tsx'
import './sales-dashboard.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SalesDataProvider>
      <SalesDashboardApp />
    </SalesDataProvider>
  </React.StrictMode>,
)
