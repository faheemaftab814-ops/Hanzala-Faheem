import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
          Customer Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          We&apos;re Here to Help
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Have an inquiry regarding custom corporate orders, sizing, or cash on delivery tracking? Connect with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact info channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#121216] border border-[#222228] rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="font-bold text-lg text-white">Direct Channels</h3>

            <div className="space-y-4">
              <a
                href="https://wa.me/923069614050?text=Hi%20HYDROVA,%20I%20have%20an%20inquiry%20regarding%20your%20stainless%20steel%20tumblers."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#17171e] hover:bg-[#1f1f28] border border-[#282834] transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6 fill-[#25D366] text-[#25D366]" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">WhatsApp (Instant Response)</div>
                  <div className="text-sm font-bold text-white group-hover:text-[#25D366] transition-colors">
                    +92 306 9614050
                  </div>
                </div>
              </a>

              <a
                href="mailto:hanzalafaheem85@gmail.com"
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#17171e] hover:bg-[#1f1f28] border border-[#282834] transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#221c10] text-[#d4af37] flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Official Inquiries & Email</div>
                  <div className="text-sm font-bold text-white group-hover:text-[#d4af37] transition-colors break-all">
                    hanzalafaheem85@gmail.com
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#17171e] border border-[#282834]">
                <div className="w-12 h-12 rounded-xl bg-[#221c10] text-[#d4af37] flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Customer Support Hours</div>
                  <div className="text-sm font-bold text-white">
                    Monday – Saturday: 9:00 AM – 10:00 PM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-[#121216] border border-[#222228] rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="font-bold text-lg text-white">Send Us a Message</h3>

          {sent && (
            <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                Thank you! Your message has been received. Our team will contact you via WhatsApp / Email shortly.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faheem Aftab"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Phone (WhatsApp preferred)
                </label>
                <input
                  type="tel"
                  placeholder="03001234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Your Message / Inquiry *
              </label>
              <textarea
                required
                rows={4}
                placeholder="How can our team assist you today?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#18181f] text-white text-xs px-3.5 py-2.5 rounded-xl border border-[#2a2a34] focus:outline-none focus:border-[#d4af37] resize-none"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
