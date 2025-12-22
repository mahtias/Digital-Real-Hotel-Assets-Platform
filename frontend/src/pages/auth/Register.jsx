// @ts-nocheck
// In handleSubmit, after successful registration:
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }
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
      // Redirect to the page they were trying to access, or home
      
      const from = location.state?.from?.pathname || '/';
      
      navigate(from, { replace: true });
    } else {
      
      setErrors({ submit: result.message });
    }
  } catch (error) {
    
    setErrors({ submit: 'An error occurred. Please try again.' });
  } finally {
    
    setLoading(false);
  }
};
