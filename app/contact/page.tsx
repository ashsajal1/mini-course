'use client';

import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{success: boolean; message: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus({
        success: true,
        message: 'Your message has been sent successfully! We&apos;ll get back to you soon.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch {
      setSubmitStatus({
        success: false,
        message: 'Something went wrong. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="py-16 bg-primary text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Have questions or feedback? We&apos;d love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Form */}
            <div className="lg:w-2/3">
              <div className="card bg-base-200 dark:bg-base-300 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-6">Send us a Message</h2>
                  
                  {submitStatus && (
                    <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-error'} mb-6`}>
                      <div>
                        <span>{submitStatus.message}</span>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-control">
                        <label className="label" htmlFor="name">
                          <span className="label-text">Your Name</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="input input-bordered w-full"
                          required
                        />
                      </div>
                      
                      <div className="form-control">
                        <label className="label" htmlFor="email">
                          <span className="label-text">Email Address</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="input input-bordered w-full"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-control">
                      <label className="label" htmlFor="subject">
                        <span className="label-text">Subject</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    
                    <div className="form-control">
                      <label className="label" htmlFor="message">
                        <span className="label-text">Your Message</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="textarea textarea-bordered w-full"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="pt-2">
                      <button 
                        type="submit" 
                        className="btn btn-primary w-full md:w-auto"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="loading loading-spinner"></span>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="lg:w-1/3 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <p className="text-base-content/80 mb-6">
                  Have questions or need assistance? Reach out to us through any of the following channels.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email Us</h3>
                    <p className="text-base-content/70">support@minicourse.com</p>
                    <p className="text-base-content/70">info@minicourse.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Call Us</h3>
                    <p className="text-base-content/70">+1 (555) 123-4567</p>
                    <p className="text-base-content/70">Mon - Fri, 9:00 AM - 6:00 PM EST</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Visit Us</h3>
                    <p className="text-base-content/70">
                      123 Learning Street<br />
                      San Francisco, CA 94107<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="font-medium mb-3">Follow Us</h3>
                <div className="flex gap-4">
                  {[
                    { name: 'Twitter', icon: '🐦' },
                    { name: 'LinkedIn', icon: '💼' },
                    { name: 'Facebook', icon: '👍' },
                    { name: 'Instagram', icon: '📷' },
                    { name: 'YouTube', icon: '▶️' }
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={`#${social.name.toLowerCase()}`}
                      className="w-10 h-10 rounded-full bg-base-200 dark:bg-base-300 flex items-center justify-center text-lg hover:bg-primary/10 hover:text-primary transition-colors"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="bg-base-200 dark:bg-base-300 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Find Us on the Map</h2>
          <div className="aspect-video bg-base-300 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-base-content/30">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4" />
                <p>Map Integration</p>
                <p className="text-sm">(Map would be displayed here in production)</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Have More Questions?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Check out our FAQ section for quick answers to common questions.
          </p>
          <a href="/faq" className="btn btn-accent text-accent-content">
            Visit FAQ
          </a>
        </div>
      </section>
    </div>
  );
}