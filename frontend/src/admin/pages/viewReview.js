import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ax from "../../conf/ax";
import conf from "../../conf/main";

const ReviewAdmin = () => {
  const [reviewData, setReviewData] = useState([]);
  const [reviewCourseData, setReviewCourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [lecturerSelectedRating, setLecturerSelectedRating] = useState(null);
  const [lecturerShowFilterOptions, setLecturerShowFilterOptions] =
    useState(false);

  const BASE_URL = conf.apiUrl;

  const fetchReview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ax.get(`${BASE_URL}/api/users`, {
        params: {
          "filters[role][name][$eq]": "Lecturer",
          populate: ["rating", "profile_picture"],
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setReviewData(response.data);
      } else {
        setReviewData([]);
      }
    } catch (error) {
      console.error("Error fetching lecturer review:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  const fetchCourseReview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ax.get(`${BASE_URL}/api/courses`, {
        params: {
          populate: ["rating", "image"],
        },
      });

      if (response.data?.data && Array.isArray(response.data.data)) {
        setReviewCourseData(response.data.data);
      } else {
        setReviewCourseData([]);
      }
    } catch (error) {
      console.error("Error fetching course review:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  const filterReviews = (rating, reviews) => {
    if (rating === null) return reviews;
    return reviews.filter((review) => review.star === rating);
  };

  const getImageUrl = (imageArray) => {
    const BASE_URL = conf.apiUrl;
    if (Array.isArray(imageArray) && imageArray.length > 0) {
      const imageObj = imageArray[0];
      const imageUrl = imageObj.formats?.thumbnail?.url || imageObj.url;
      return imageUrl ? `${BASE_URL}${imageUrl}` : "/placeholder.svg";
    }
    return "/placeholder.svg";
  };

  useEffect(() => {
    fetchReview();
    fetchCourseReview();
  }, [fetchReview, fetchCourseReview]);

  const ReviewSection = ({
    title,
    data,
    setSelected,
    selected,
    selectedRating,
    setSelectedRating,
    showFilterOptions,
    setShowFilterOptions,
  }) => {
    const filteredReviews = selected
      ? filterReviews(selectedRating, selected.rating)
      : [];

    return (
      <div className="mb-12 pt-12">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white text-center">
          {title}
        </h2>

        {loading && (
          <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
        )}
        {error && (
          <p className="text-center text-red-500">เกิดข้อผิดพลาด: {error}</p>
        )}
        {!loading && !error && data.length === 0 && (
          <p className="text-center text-gray-500">ไม่มีรีวิวที่จะแสดง</p>
        )}

        {/* แสดงรายการรีวิว */}
        {!loading && !error && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => {
              const isSelected = selected?.id === item.id;

              return (
                <AnimatePresence key={item.id}>
                  {isSelected ? (
                    <motion.div
                      className="col-span-1 sm:col-span-2 lg:col-span-3 bg-white p-6 border rounded-lg shadow-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                    >
                      {/* แสดงรายละเอียดแทนการ์ด */}
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-semibold text-black">
                          {selected.first_name
                            ? `${selected.first_name} ${selected.last_name}`
                            : selected.Name}
                        </h3>
                        <button
                          className="text-gray-500 hover:text-gray-800"
                          onClick={() => {
                            setSelected(null);
                            setShowFilterOptions(false);
                            setSelectedRating(null);
                          }}
                        >
                          ✖
                        </button>
                      </div>

                      <div className="mb-4">
                        {!showFilterOptions ? (
                          <button
                            className="px-4 py-2 text-sm rounded bg-gradient-to-r from-teal-400 to-green-200 text-black font-bold"
                            onClick={() => setShowFilterOptions(true)}
                          >
                            แสดงตัวเลือกฟิลเตอร์
                          </button>
                        ) : (
                          <div>
                            <button
                              className="px-4 py-2 text-sm rounded bg-gradient-to-r from-red-400 to-red-700 text-black font-bold mb-2"
                              onClick={() => {
                                setShowFilterOptions(false);
                                setSelectedRating(null);
                              }}
                            >
                              ปิดฟิลเตอร์
                            </button>
                            <div className="flex flex-wrap gap-2">
                              {[5, 4, 3, 2, 1].map((star) => (
                                <button
                                  key={star}
                                  className={`px-4 py-2 text-sm rounded border-2 
                                    ${
                                      selectedRating === star
                                        ? "bg-gray-900 text-white border-gray-900 shadow-lg"
                                        : "bg-gray-700 text-white border-transparent"
                                    }
                                  `}
                                  onClick={() => setSelectedRating(star)}
                                >
                                  {star} ดาว (
                                  {filterReviews(star, selected.rating).length})
                                </button>
                              ))}
                              <button
                                className={`px-4 py-2 text-sm rounded border-2 
                                  ${
                                    selectedRating === null
                                      ? "bg-gray-900 text-white border-gray-900 shadow-lg"
                                      : "bg-gray-700 text-white border-transparent"
                                  }
                                `}
                                onClick={() => setSelectedRating(null)}
                              >
                                รีวิวทั้งหมด ({selected.rating.length})
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        Reviews ({filteredReviews.length}):
                      </h4>
                      {filteredReviews.length > 0 ? (
                        <ul className="space-y-4">
                          {filteredReviews.map((review) => (
                            <li
                              key={review.id}
                              className="border-b pb-4 last:border-none"
                            >
                              <div className="flex items-start">
                                <div className="flex-shrink-0 mr-3">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <span
                                      key={i}
                                      className={`text-lg ${
                                        i < review.star
                                          ? "text-yellow-500"
                                          : "text-gray-300"
                                      }`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <p className="text-gray-700 text-sm sm:text-base italic">
                                  "{review.comment}"
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No reviews yet.</p>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex items-center p-6 border rounded-lg shadow-lg cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => setSelected(item)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <img
                        src={getImageUrl(item.profile_picture || item.image)}
                        alt={item.first_name || item.Name || "No Image"}
                        className="w-20 h-20 rounded-full object-cover mr-6"
                      />

                      <div>
                        <h3 className="text-xl font-semibold">
                          {item.first_name && item.last_name
                            ? `${item.first_name} ${item.last_name}`
                            : item.Name}
                        </h3>
                        <p className="text-gray-500">
                          {Array.isArray(item.rating)
                            ? `⭐ ${(
                                item.rating.reduce(
                                  (sum, r) => sum + r.star,
                                  0
                                ) / item.rating.length
                              ).toFixed(1)}`
                            : item.rating?.average
                            ? `⭐ ${item.rating.average.toFixed(1)}`
                            : "ไม่มีคะแนน"}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:w-[1000px] lg:ml-96 max-w-7xl">
      <ReviewSection
        title="รีวิวทั้งหมดของอาจารย์"
        data={reviewData}
        setSelected={setSelectedLecturer}
        selected={selectedLecturer}
        selectedRating={lecturerSelectedRating}
        setSelectedRating={setLecturerSelectedRating}
        showFilterOptions={lecturerShowFilterOptions}
        setShowFilterOptions={setLecturerShowFilterOptions}
      />
      <ReviewSection
        title="รีวิวทั้งหมดของคอร์ส"
        data={reviewCourseData}
        setSelected={setSelectedCourse}
        selected={selectedCourse}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        showFilterOptions={showFilterOptions}
        setShowFilterOptions={setShowFilterOptions}
      />
    </div>
  );
};

export default ReviewAdmin;
