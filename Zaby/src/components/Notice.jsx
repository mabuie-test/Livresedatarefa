import React from 'react';
export default function Notice({ type='success', children }){
  return <div className={`notice ${type}`}>{children}</div>;
}
