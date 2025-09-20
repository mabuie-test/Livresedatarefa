import React from 'react';

export default function Footer(){
  return (
    <footer className="bg-white mt-8 border-t">
      <div className="container mx-auto p-6 text-sm text-gray-600">
        © {new Date().getFullYear()} Livresedatarefa — Trabalhos com liberdade. Pesquisa com rigor.
      </div>
    </footer>
  );
}
