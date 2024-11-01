import React, { useState } from 'react';
import Modal from 'react-modal';

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, item: string,payment:string) => void;
  item: string;
  type: string; // Specify the type prop as 'cancel' or 'return'
  payment:string;
}

// Set the app element for accessibility
Modal.setAppElement('#root');

const CancellationModal: React.FC<CancellationModalProps> = ({ isOpen, onClose, onSubmit, item, type,payment }) => {
  const [reason, setReason] = useState<string>('');

  const handleSubmit = () => {
    if (reason) {
    
      onSubmit(item,reason,payment );
      onClose();
    }
  };

  // Determine title and message based on type
  const modalTitle = type === 'cancel' ? 'Cancel Your Order' : 'Return Your Item';
  const modalMessage = type === 'cancel'
    ? 'We’re sorry to see you go! Please let us know why you are cancelling:'
    : 'We’re here to help! Please let us know why you want to return:';

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="w-full max-w-lg p-8 bg-gray-800 rounded-lg shadow-lg mx-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center"
    >
      <h2 className="text-2xl font-bold text-center text-white mb-4">{modalTitle}</h2>
      <p className="text-center text-gray-300 mb-6">{modalMessage}</p>
      <select
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full p-3 mb-6 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      >
        <option value="">-- Select Reason --</option>
        {type === 'cancel' && (
          <>
            <option value="Changed my mind">Changed my mind</option>
            <option value="Item not as described">Item not as described</option>
            <option value="Found a better price">Found a better price</option>
            <option value="Delay in delivery">Delay in delivery</option>
            <option value="Other">Other</option>
          </>
        )}
        {type === 'return' && (
          <>
            <option value="Defective item">Defective item</option>
            <option value="Wrong item received">Wrong item received</option>
            <option value="Sizing issue">Sizing issues</option>
            <option value="Other">Other</option>
          </>
        )}
      </select>

      <div className="flex justify-between">
        <button
          onClick={onClose}
          className="w-full mr-2 py-2 px-4 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="w-full ml-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Submit {type === 'cancel' ? 'Cancellation' : 'Return'}
        </button>
      </div>
    </Modal>
  );
};

export default CancellationModal;
