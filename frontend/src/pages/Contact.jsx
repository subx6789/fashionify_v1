import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header Banner */}
      <section className="border-b border-neutral-200 bg-neutral-50 py-16 text-center sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <span className="text-[12px] font-bold tracking-[0.25em] text-[#707070] uppercase">
            GET IN TOUCH
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#111111] uppercase sm:text-5xl font-['Plus_Jakarta_Sans']">
            CONTACT US
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#555555]">
            Have a question about your order, shipping, or press inquiries? Connect with us directly.
          </p>
        </div>
      </section>

      {/* Main Info Cards Section */}
      <section className="mx-auto max-w-5xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Email Support Card */}
          <div className="rounded-lg border border-neutral-200 p-8 text-center hover:border-neutral-400 transition-colors shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-[#111111]">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-[#111111] uppercase font-['Plus_Jakarta_Sans']">
              Email Us
            </h3>
            <p className="mt-2 text-xs text-[#707070]">For order support and inquiries</p>
            <p className="mt-4 text-sm font-semibold text-[#111111]">support@fashionify.com</p>
          </div>

          {/* Phone Card */}
          <div className="rounded-lg border border-neutral-200 p-8 text-center hover:border-neutral-400 transition-colors shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-[#111111]">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-[#111111] uppercase font-['Plus_Jakarta_Sans']">
              Call Us
            </h3>
            <p className="mt-2 text-xs text-[#707070]">Toll-free customer hotline</p>
            <p className="mt-4 text-sm font-semibold text-[#111111]">+91 987654XXXX</p>
          </div>

          {/* Location Card */}
          <div className="rounded-lg border border-neutral-200 p-8 text-center hover:border-neutral-400 transition-colors shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-[#111111]">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-[#111111] uppercase font-['Plus_Jakarta_Sans']">
              Address
            </h3>
            <p className="mt-2 text-xs text-[#707070]">New Town, Kolkata</p>
            <p className="mt-4 text-sm font-semibold text-[#111111]">West Bengal, India</p>
          </div>
        </div>

        {/* Additional Details */}
        <div className="mt-12 rounded-lg bg-neutral-50 p-8 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white p-3 border border-neutral-200 text-[#111111]">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111111] uppercase">Support Hours</h4>
              <p className="text-xs text-[#555555]">Monday – Friday: 9:00 AM – 6:00 PM IST</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white p-3 border border-neutral-200 text-[#111111]">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111111] uppercase">Response Time</h4>
              <p className="text-xs text-[#555555]">All customer inquiries answered within 24 hours</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
