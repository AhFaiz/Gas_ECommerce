
import React from 'react';
import { Calendar } from 'lucide-react';

const Activities = () => {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="page-container">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Calendar size={48} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Activities</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay up to date with our latest events, workshops, and community activities.
          </p>
        </div>
        
        <div className="mt-16 space-y-8">
          {[
            { date: "October 15, 2023", title: "Community Outreach Program", description: "Join us for a day of giving back to the community through various initiatives." },
            { date: "November 5, 2023", title: "Safety Workshop", description: "Learn best practices for gas safety in your home and workplace." },
            { date: "December 12, 2023", title: "Annual Customer Appreciation Day", description: "A special event to thank our loyal customers with exclusive offers and entertainment." }
          ].map((activity, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-6 border-b pb-8">
              <div className="md:w-1/4">
                <div className="bg-accent p-4 rounded-lg inline-block">
                  <span className="text-lg font-medium">{activity.date}</span>
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                <p className="text-muted-foreground">{activity.description}</p>
                <button className="mt-4 text-primary font-medium hover:underline">Learn more</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activities;
