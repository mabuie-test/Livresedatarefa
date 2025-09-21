// frontend/src/pages/OrderDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import MpesaProofUpload from '../components/MpesaProofUpload';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/api/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error('Erro ao carregar pedido', err);
        alert('Erro ao carregar pedido. Verifique a consola.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (!order) return <div>Pedido não encontrado.</div>;

  // calcula URL absoluta do PDF
  const invoiceUrl = order.invoicePdfUrl
    ? (order.invoicePdfUrl.startsWith('http') ? order.invoicePdfUrl : `${import.meta.env.VITE_API_URL}${order.invoicePdfUrl}`)
    : null;

  const adminFileUrl = order.adminFileUrl
    ? (order.adminFileUrl.startsWith('http') ? order.adminFileUrl : `${import.meta.env.VITE_API_URL}${order.adminFileUrl}`)
    : null;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Pedido {order.reference}</h2>
      <div className="text-sm text-gray-600 mb-4">
        Serviço: {order.serviceType} • Nível: {order.academicLevel} • Páginas: {order.pages}
      </div>

      <div className="mb-4">
        <div className="font-medium">Estado:</div>
        <div className="mb-2">{order.status}</div>

        <div className="font-medium">Total:</div>
        <div className="mb-2">{order.totalPriceMZN} MZN</div>
      </div>

      <div className="mb-4">
        <div className="font-medium">Recibo / Invoice</div>
        {invoiceUrl ? (
          <a href={invoiceUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 bg-brand text-white px-4 py-2 rounded">
            Abrir Recibo (PDF)
          </a>
        ) : (
          <div className="text-sm text-gray-500 mt-2">Recibo ainda não gerado.</div>
        )}
      </div>

      <div className="mb-4">
        <div className="font-medium">Entregável final (admin)</div>
        {adminFileUrl ? (
          <a href={adminFileUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 bg-accent text-white px-4 py-2 rounded">
            Baixar ficheiro final
          </a>
        ) : (
          <div className="text-sm text-gray-500 mt-2">Ficheiro ainda não disponível.</div>
        )}
      </div>

      <div className="mb-4">
        <button className="bg-gray-100 px-3 py-1 rounded" onClick={() => setShowUpload(s => !s)}>
          {showUpload ? 'Fechar envio de comprovativo' : 'Enviar comprovativo Mpesa'}
        </button>
        {showUpload && <div className="mt-3"><MpesaProofUpload orderId={order._id} onUploaded={(o) => setOrder(o)} /></div>}
      </div>

      <div className="mt-6 text-xs text-gray-500">
        Observação: o download só será permitido após confirmação de pagamento pelo admin.
      </div>
    </div>
  );
}
