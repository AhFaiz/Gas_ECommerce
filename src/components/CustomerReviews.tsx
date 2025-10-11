import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import Testimonial from './Testimonial';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

const CustomerReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch all testimonials
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedReviews: Review[] = (data || []).map((testimonial) => ({
        id: testimonial.id,
        name: testimonial.name,
        role: 'Customer',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.name}`,
        content: testimonial.comment,
        rating: testimonial.rating
      }));

      setReviews(formattedReviews);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !comment.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('testimonials')
        .insert([
          {
            name: name.trim(),
            rating: rating,
            comment: comment.trim()
          }
        ]);

      if (error) throw error;

      setName('');
      setComment('');
      setRating(5);
      
      // Refetch testimonials to show the new one instantly
      await fetchTestimonials();
      
      toast({
        title: "Thank you for your feedback!",
        description: "Your review has been submitted successfully.",
      });
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-padding bg-accent/30">
      <div className="page-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-foreground/70 text-lg">
            Share your experience and see what others are saying.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No reviews yet. Be the first to share your experience!
            </div>
          ) : (
            reviews.map((review, index) => (
              <div
                key={review.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Testimonial {...review} />
              </div>
            ))
          )}
        </div>

        {/* Submit Review Form */}
        <div className="max-w-2xl mx-auto bg-card rounded-xl shadow-sm border border-border/50 p-6 md:p-8">
          <h3 className="text-xl font-display font-semibold text-foreground mb-6">
            Share Your Experience
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                maxLength={100}
              />
            </div>

            {/* Rating Input */}
            <div className="space-y-2">
              <Label>Your Rating</Label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform-300 hover:scale-110"
                  >
                    <Star
                      size={32}
                      fill={star <= (hoveredRating || rating) ? 'hsl(48 96% 53%)' : 'none'}
                      className={star <= (hoveredRating || rating) ? 'text-secondary' : 'text-muted-foreground'}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Input */}
            <div className="space-y-2">
              <Label htmlFor="comment">Your Review</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience with our service..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full min-h-[120px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {comment.length}/500
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
