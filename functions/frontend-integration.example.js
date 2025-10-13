// Frontend Integration Example for Trade Hustle Resume Builder
// Place this in your Next.js component or vanilla JavaScript

// Example: Create checkout session from your website
async function handleCheckout(userId = null) {
  try {
    // Get Firebase Auth token if user is logged in
    let headers = {
      'Content-Type': 'application/json',
    };

    // Add auth token if user is authenticated
    if (userId && window.firebase?.auth) {
      const user = window.firebase.auth().currentUser;
      if (user) {
        const token = await user.getIdToken();
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await fetch(
      'https://us-central1-tradehustleresumebuilder.cloudfunctions.net/createCheckout',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userId: userId || 'guest',
          service: 'resume_builder',
        }),
      }
    );

    const data = await response.json();
    
    if (data.success && data.url) {
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } else {
      throw new Error(data.message || 'Checkout failed');
    }
  } catch (error) {
    console.error('Checkout failed:', error);
    alert('Payment setup failed. Please try again.');
  }
}

// React Component Example
export function CheckoutButton({ userId, className = '' }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await handleCheckout(userId);
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleClick}
      disabled={loading}
      className={`btn-hustle ${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Setting up payment...' : 'Unlock Resume Builder - $XX'}
    </button>
  );
}

// Usage in your Trade Hustle website:
// <CheckoutButton userId={user?.uid} className="hero-cta-button" />

// Success page handling (pages/success.js):
export async function getServerSideProps({ query }) {
  const { session_id } = query;
  
  if (session_id) {
    // Optionally verify the session with Stripe
    // and update user permissions in your database
    console.log('Payment successful for session:', session_id);
  }
  
  return { props: { sessionId: session_id } };
}