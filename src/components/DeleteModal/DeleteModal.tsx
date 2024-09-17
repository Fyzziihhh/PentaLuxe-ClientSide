import React from 'react';
import Modal from 'react-modal';
interface IDeleteModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    item: {
      id: string;
      name: string;
    } | null;  // The item can be null if no item is selected
    onDelete: (id: string) => void;  // Pass the id to the delete handler
  }
// Bind modal to your appElement (important for accessibility)
Modal.setAppElement('#root');

const DeleteModal:React.FC<IDeleteModalProps> = ({
  isOpen,
  onRequestClose,
  item,
  onDelete
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Delete Confirmation"
      className="fixed inset-0 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75"
    >
      <div className="bg-white rounded-lg shadow-md p-6 w-96 max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Delete Confirmation</h2>
        <p className="text-base text-black mb-6">
          Are you sure you want to delete <strong>{item?.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm"
            onClick={onRequestClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
            onClick={() => {
              if (item && item.id) onDelete(item?.id);
              onRequestClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
