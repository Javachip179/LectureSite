import React from 'react';
import './style.scss';
const PaymentModal = ({
  isOpen,
  onClose,
  onPayWithKakaoPay,
  onPayWithTossPay,
  onPayNormally,
}) => {
  if (!isOpen) return null;

  return (
    <div className='modal-backdrop'>
      <div className='modal-content'>
        <div className='title'>결제 방식</div>
        <div className='pay-buttons'>
          <button className='kakaopay' onClick={onPayWithKakaoPay}></button>
          <button className='tosspay' onClick={onPayWithTossPay}></button>
          <button className='normalpay' onClick={onPayNormally}>
            일반 결제
          </button>
        </div> 
        <button className='close-button' onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
