import { createClient } from '@/lib/supabase/client';
const supabase = createClient();

export async function subscribeToNewsletter(email: string) {
  try {
    // Generate a confirmation token
    const confirmationToken = Math.random().toString(36).substring(2, 15) + 
                             Math.random().toString(36).substring(2, 15);
    
    // Insert the subscription into the database
    const { error } = await supabase
      .from('newsletter')
      .insert({
        email: email,
        confirmation_token: confirmationToken
      });

    if (error) {
      // Handle duplicate email error
      if (error.code === '23505') {
        throw new Error('Email ini sudah berlangganan newsletter kami.');
      }
      throw new Error(error.message);
    }

    // In a real implementation, you would send a confirmation email here
    // For now, we'll just return success
    return { 
      success: true, 
      message: 'Terima kasih telah berlangganan! Silakan periksa email Anda untuk konfirmasi.' 
    };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Terjadi kesalahan saat berlangganan newsletter' 
    };
  }
}

export async function confirmNewsletterSubscription(token: string) {
  try {
    const { error } = await supabase
      .from('newsletter')
      .update({ 
        confirmed: true, 
        confirmed_at: new Date() 
      })
      .eq('confirmation_token', token);

    if (error) {
      throw new Error(error.message);
    }

    return { 
      success: true, 
      message: 'Berlangganan newsletter berhasil dikonfirmasi!' 
    };
  } catch (error) {
    console.error('Error confirming newsletter subscription:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengkonfirmasi berlangganan' 
    };
  }
}