// @ts-nocheck
// In handleSubmit, after successful registration:
import { toast } from "sonner";

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setLoading(true);
  setErrors({});

  try {
    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      // Registration succeeded, but user is NOT auto-logged-in
      // Because email verification is required
       toast.success("Registration successful! Check your email for the verification link.");
      navigate('/verify-email-sent', {
        state: { email: formData.email }
      });
    } else {
      setErrors({ submit: result.message });
    }

  } catch (error) {
    setErrors({ submit: 'An error occurred. Please try again.' });
  } finally {
    setLoading(false);
  }
};

