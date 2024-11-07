
import { Link } from 'react-router-dom'
import { Heart } from "lucide-react"; // Importing a heart icon for the wishlist

const EmptyWishlist = () => {
  return (
    <div className='flex flex-col items-center justify-center space-y-4 py-16'>
      <Heart className='h-24 w-24 text-gray-300' /> {/* Changed to Heart icon */}
      <h3 className='text-2xl font-semibold'>Your wishlist is empty</h3> {/* Updated text */}
      <p className='text-gray-400'>Looks like you {"haven't"} added anything to your wishlist yet.</p> {/* Updated text */}
      <Link
        className='mt-4 rounded-md bg-emerald-500 px-6 py-2 text-white transition-colors hover:bg-emerald-600'
        to='/products'
      >
        Start Adding Items
      </Link> {/* Updated link text */}
    </div>
  )
}

export default EmptyWishlist;
