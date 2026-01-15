import { useState } from 'react';

interface FormData {
  objectType: string;
  interest: string;
  fullName: string;
  email: string;
  title: string;
  companyName: string;
  socialContact: string;
}

const FloatingContactForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    objectType: '',
    interest: '',
    fullName: '',
    email: '',
    title: '',
    companyName: '',
    socialContact: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const objectTypes = [
    'Studio / Publisher',
    'Investor',
    'Service Provider',
    'Other',
  ];

  const interests = [
    'Marketing agency services',
    'Gaming business strategy',
    'Go-to-market services',
    'Talk to GameGeek in person',
    'Other',
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1 && formData.objectType) {
      setCurrentStep(2);
    } else if (currentStep === 2 && formData.interest) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.title || !formData.companyName) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const googleSheetsUrl = import.meta.env.PUBLIC_GOOGLE_SHEETS_WEB_APP_URL;

      if (!googleSheetsUrl) {
        console.warn('Google Sheets Web App URL not configured. Please set PUBLIC_GOOGLE_SHEETS_WEB_APP_URL in .env file.');
        alert('Form submission is not configured. Please contact the administrator.');
        setSubmitStatus('error');
        setIsSubmitting(false);
        return;
      }

      const timestamp = new Date().toISOString();
      
      // Submit to Google Sheets via Web App
      // Using no-cors mode because Google Apps Script may not support CORS
      const response = await fetch(googleSheetsUrl, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script web app doesn't support CORS
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp,
          objectType: formData.objectType,
          interest: formData.interest,
          fullName: formData.fullName,
          email: formData.email,
          title: formData.title,
          companyName: formData.companyName,
          socialContact: formData.socialContact || '',
        }),
      });

      // With no-cors mode, response will always be opaque (we can't read it)
      // But if no error is thrown, we assume success
      setSubmitStatus('success');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          objectType: '',
          interest: '',
          fullName: '',
          email: '',
          title: '',
          companyName: '',
          socialContact: '',
        });
        setCurrentStep(1);
        setIsOpen(false);
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return formData.objectType !== '';
    if (currentStep === 2) return formData.interest !== '';
    return false;
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="floating-contact-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Contact us"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Form Modal */}
      {isOpen && (
        <div className="floating-form-overlay" onClick={() => setIsOpen(false)}>
          <div className="floating-form-container" onClick={(e) => e.stopPropagation()}>
            <div className="floating-form-header">
              <h3>Get in Touch</h3>
              <button
                className="floating-form-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="floating-form-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                ></div>
              </div>
              <span className="progress-text">Step {currentStep} of 3</span>
            </div>

            <form onSubmit={handleSubmit} className="floating-form-content">
              {/* Step 1: Object Type */}
              {currentStep === 1 && (
                <div className="form-step">
                  <h4>You are…</h4>
                  <div className="form-group">
                    <select
                      value={formData.objectType}
                      onChange={(e) => handleInputChange('objectType', e.target.value)}
                      className="form-select"
                      required
                    >
                      <option value="">Select an option</option>
                      {objectTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNext}
                      disabled={!canProceed()}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Interest */}
              {currentStep === 2 && (
                <div className="form-step">
                  <h4>What are you looking for?</h4>
                  <div className="form-group">
                    <select
                      value={formData.interest}
                      onChange={(e) => handleInputChange('interest', e.target.value)}
                      className="form-select"
                      required
                    >
                      <option value="">Select an option</option>
                      {interests.map((interest) => (
                        <option key={interest} value={interest}>
                          {interest}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNext}
                      disabled={!canProceed()}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Information */}
              {currentStep === 3 && (
                <div className="form-step">
                  <h4>Contact Information</h4>
                  <p className="form-description">
                    Please share a few details so our team can better understand your needs and get in touch.
                  </p>
                  
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Working Email *</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="title">Title / Position *</label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="companyName">Company Name *</label>
                    <input
                      type="text"
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="socialContact">Social Contact Link (Optional)</label>
                    <input
                      type="text"
                      id="socialContact"
                      value={formData.socialContact}
                      onChange={(e) => handleInputChange('socialContact', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>

                  {submitStatus === 'success' && (
                    <div className="form-message success">
                      Thank you! Your message has been submitted successfully.
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="form-message error">
                      There was an error submitting your form. Please try again.
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      <style>{`
        .floating-contact-btn {
          position: fixed;
          bottom: 100px;
          right: 22px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #FF5E14;
          border: none;
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(255, 94, 20, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 9998;
        }

        .floating-contact-btn:hover {
          transform: scale(1.1);
          background: #e54d00;
          box-shadow: 0 6px 25px rgba(255, 94, 20, 0.5);
        }

        .floating-form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .floating-form-container {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .floating-form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .floating-form-header h3 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
        }

        .floating-form-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .floating-form-close:hover {
          color: #1f2937;
        }

        .floating-form-progress {
          padding: 16px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .progress-bar {
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: #FF5E14;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 12px;
          color: #6b7280;
        }

        .floating-form-content {
          padding: 24px;
        }

        .form-step h4 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
        }

        .form-description {
          margin: 0 0 24px 0;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.5;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .form-input,
        .form-select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #FF5E14;
          box-shadow: 0 0 0 3px rgba(255, 94, 20, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }

        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-primary {
          background: #FF5E14;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #e54d00;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 94, 20, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .form-message {
          margin-top: 16px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
        }

        .form-message.success {
          background: #d1fae5;
          color: #065f46;
        }

        .form-message.error {
          background: #fee2e2;
          color: #991b1b;
        }

        @media (max-width: 767px) {
          .floating-contact-btn {
            bottom: 20px;
            right: 20px;
            width: 56px;
            height: 56px;
          }

          .floating-form-container {
            max-width: 100%;
            margin: 0;
            border-radius: 16px 16px 0 0;
            max-height: 85vh;
          }

          .floating-form-overlay {
            align-items: flex-end;
            padding: 0;
          }
        }
      `}</style>
    </>
  );
};

export default FloatingContactForm;
