import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { submitReview, getUserReview, getAllReviews } from "../../api/reviewapi";
import Navbar from "../../Components/Layouts/Navbar";
import Footer from "../../Components/Layouts/Footer";
import Aboutimage from "../../assets/Images/Aboutimage.png";
import { Users, GraduationCap, Award, CheckCircle, Star, Quote } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";

const stats = [
  { Icon: Users, value: "15K+", label: "Students Enrolled" },
  { Icon: Users, value: "5K+", label: "Teachers Enrolled" },
  { Icon: Award, value: "75%", label: "Success Rate" },
  { Icon: GraduationCap, value: "5", label: "Years of Experience" },
];

const About = () => {
  const { authToken, user } = useSelector((state) => state.auth);
  const [userReview, setUserReview] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    content: "",
    rating: 5,
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAllReviews();
    if (authToken) {
      checkUserReview();
    }
  }, [authToken]);

  const fetchAllReviews = async () => {
    try {
      const response = await getAllReviews();
      setAllReviews(response);
    } catch (error) {
      console.log("Failed to fetch reviews:", error);
    }
  };

  const checkUserReview = async () => {
    try {
      const review = await getUserReview();
      setUserReview(review);
    } catch (error) {
      console.log("No existing review found for user");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!authToken) {
      setSubmitStatus("Please login to submit a review");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await submitReview({
        ...reviewForm,
        name: user?.username || "Anonymous",
        role: user?.role || "User",
      });
      setUserReview(response);
      setSubmitStatus("Review submitted successfully! Thank you for your feedback.");
      setReviewForm({ content: "", rating: 5 });
      fetchAllReviews();
    } catch (error) {
      setSubmitStatus("Failed to submit review: " + (error.error || error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="flex-grow px-4 pt-20 sm:px-6 lg:px-8 md:pt-30 relative z-10">
          {/* About Us Heading */}
          <div className="text-center mb-12 sm:mb-16 relative">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight relative inline-block drop-shadow-sm">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400">Us</span>
            </h1>
            <p className="text-teal-800/80 mt-4 max-w-2xl mx-auto text-lg sm:text-xl font-medium">
              Discover how ClassSphere is redefining education management with innovative solutions.
            </p>
          </div>

          {/* Hero Section */}
          <section className="max-w-6xl mx-auto py-8 sm:py-12 grid md:grid-cols-2 gap-8 sm:gap-10 items-center">
            <div className="relative flex justify-center">
              <img
                src={Aboutimage}
                alt="ClassSphere Platform"
                className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-md rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-102"
              />
              <div className="absolute -bottom-3 -left-3 bg-teal-400 h-16 sm:h-20 md:h-24 w-16 sm:w-20 md:w-24 rounded-full opacity-20 blur-2xl"></div>
            </div>
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <CheckCircle className="text-teal-600 w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-teal-600 font-semibold text-base sm:text-lg">Innovative Education</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Elevating Learning with <span className="text-teal-600">ClassSphere</span>
              </h2>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                ClassSphere is a cutting-edge, cloud-based platform that streamlines school management—integrating scheduling, attendance, payments, and virtual classrooms into one seamless experience.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <a
                  href="#"
                  className="bg-teal-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-medium shadow-md hover:bg-teal-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                  Learn More
                </a>
                <a
                  href="#"
                  className="border-2 border-teal-600 text-teal-600 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-medium shadow-md hover:bg-teal-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="max-w-6xl mx-auto py-8 sm:py-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10 text-gray-900">Our Milestones</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg border border-teal-100 hover:shadow-2xl hover:shadow-teal-500/20 hover:-translate-y-2 hover:scale-105 transition-all duration-500 group"
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-4 p-4 bg-gradient-to-br from-teal-100 to-teal-50 rounded-2xl group-hover:bg-teal-500 transition-colors duration-300">
                      <stat.Icon className="text-teal-600 w-8 h-8 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold text-teal-600">{stat.value}</h4>
                    <p className="text-gray-600 text-xs sm:text-xs uppercase tracking-wide mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Enhanced Review Submission Section */}
          {authToken && !userReview && (
            <section className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
              <div className="mb-6 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Share Your Experience
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                  Your feedback helps us improve our platform and guides other users.
                </p>
              </div>

              <form
                onSubmit={handleReviewSubmit}
                className="bg-white/60 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-xl border border-white/50 flex flex-col gap-6 relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-400 rounded-full filter blur-3xl opacity-20"></div>
                <div className="flex flex-col gap-3 relative z-10">
                  <label htmlFor="review-content" className="text-gray-800 font-semibold text-sm sm:text-base">
                    Your Review
                  </label>
                  <textarea
                    id="review-content"
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                    className="w-full p-4 sm:p-5 border border-teal-100 bg-white/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 shadow-sm text-gray-700"
                    rows="4"
                    placeholder="Tell us about your experience with ClassSphere..."
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="rating" className="text-gray-700 font-medium text-sm sm:text-base">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-1 sm:gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: num })}
                          className="focus:outline-none transition-transform duration-200 hover:scale-110"
                        >
                          <Star
                            size={24}
                            className={`${
                              reviewForm.rating >= num
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-200 text-gray-300'
                            } transition-colors duration-200`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sm:ml-auto self-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full sm:w-auto bg-gradient-to-r from-teal-500 to-teal-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      ) : null}
                      Submit Review
                    </button>
                  </div>
                </div>
              </form>

              {submitStatus && (
                <div className={`mt-4 p-3 rounded-lg text-center text-sm sm:text-base ${
                  submitStatus.includes("success") || submitStatus.includes("Thank you")
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {submitStatus}
                </div>
              )}
            </section>
          )}

          {/* User Has Already Submitted Review */}
          {authToken && userReview && (
            <section className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-5 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-teal-700 mb-2">
                  Thanks for Your Feedback!
                </h3>
                <p className="text-teal-600 text-sm sm:text-base">
                  You've already submitted a review. We appreciate your contribution!
                </p>
                <div className="flex justify-center mt-3">
                  {[...Array(userReview.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* All Reviews Section */}
          <section className="max-w-6xl mx-auto py-8 sm:py-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10 text-gray-900">
              Voices of Success
            </h2>
            {allReviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {allReviews.slice(-4).map((review, index) => (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg border border-teal-100 hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-center mb-3 sm:mb-4 capitalize">
                      {review.avatar ? (
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-teal-200"
                        />
                      ) : (
                        <FaUserCircle className="w-10 h-10 sm:w-12 sm:h-12 text-teal-600" />
                      )}
                      <div className="ml-2 sm:ml-3">
                        <h4 className="font-bold text-sm sm:text-base text-gray-900">{review.name}</h4>
                        <p className="text-xs text-gray-600">{review.role}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Quote className="text-teal-500 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed italic">
                      {review.content.length > 100 ? review.content.slice(0, 200) + "......." : review.content}
                      </p>
                    </div>
                    <div className="flex mt-2 sm:mt-3 text-teal-500">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No reviews yet. Be the first to share your experience!</p>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;