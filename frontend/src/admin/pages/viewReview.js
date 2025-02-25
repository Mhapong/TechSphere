import { useState, useEffect, useContext, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AuthContext } from "../../context/Auth.context"
import ax from "../../conf/ax"

const ReviewAdmin = () => {
  const { state: ContextState } = useContext(AuthContext)
  const { user } = ContextState
  const [reviewData, setReviewData] = useState([])
  const [reviewCourseData, setReviewCourseData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedLecturer, setSelectedLecturer] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedRating, setSelectedRating] = useState(null)
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [lecturerSelectedRating, setLecturerSelectedRating] = useState(null)
  const [lecturerShowFilterOptions, setLecturerShowFilterOptions] = useState(false)

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:1337"

  const fetchReview = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await ax.get(`${BASE_URL}/api/users`, {
        params: {
          "filters[role][name][$eq]": "Lecturer",
          populate: ["rating", "profile_picture"],
        },
      })

      console.log("Lecturer Data Response:", response.data)

      if (response.data && Array.isArray(response.data)) {
        setReviewData(response.data)
      } else {
        setReviewData([])
      }
    } catch (error) {
      console.error("Error fetching lecturer review:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [BASE_URL])

  const fetchCourseReview = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await ax.get(`${BASE_URL}/api/courses`, {
        params: {
          populate: ["rating", "image"],
        },
      })

      console.log("Course Data Response:", response.data.data)

      if (response.data?.data && Array.isArray(response.data.data)) {
        setReviewCourseData(response.data.data)
      } else {
        setReviewCourseData([])
      }
    } catch (error) {
      console.error("Error fetching course review:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [BASE_URL])

  const filterReviews = (rating, reviews) => {
    if (rating === null) return reviews
    return reviews.filter((review) => review.star === rating)
  }

  useEffect(() => {
    fetchReview()
    fetchCourseReview()
  }, [fetchReview, fetchCourseReview])

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
    const filteredReviews = selected ? filterReviews(selectedRating, selected.rating) : []

    return (
      <div className="mb-12">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white text-center">
          {title}
        </h2>
        {loading && <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>}
        {error && <p className="text-center text-red-500">เกิดข้อผิดพลาด: {error}</p>}
        {!loading && !error && data.length === 0 && <p className="text-center text-gray-500">ไม่มีรีวิวที่จะแสดง</p>}
        {!loading && !error && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item, index) => {
              const image =
                item?.profile_picture?.[0]?.url || item?.image?.[0]?.url
                  ? `${BASE_URL}${item.profile_picture?.[0]?.url || item.image[0].url}`
                  : "/default-profile.png"
              const averageRating =
                item.rating && item.rating.length > 0
                  ? (item.rating.reduce((acc, review) => acc + review.star, 0) / item.rating.length).toFixed(1)
                  : "0.0"

              return (
                <motion.div
                  key={item.id}
                  className="flex items-center p-6 border rounded-lg shadow-lg cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => {
                    setSelected(selected?.id === item.id ? null : item)
                    setSelectedRating(null)
                    setShowFilterOptions(false)
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${item.first_name || ""} ${item.last_name || ""} ${item.Name || ""}`}
                    className="w-20 h-20 rounded-full object-cover mr-6"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-black">
                      {item.first_name ? `${item.first_name} ${item.last_name}` : item.Name}
                    </h3>
                    <div className="flex items-center mt-2">
                      <span className="text-2xl text-yellow-500 mr-2">⭐</span>
                      <span className="text-yellow-500 font-semibold text-lg sm:text-xl">{averageRating}</span>
                      <span className="text-gray-500 text-base ml-2">/ 5</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
        <AnimatePresence>
          {selected && (
            <div className="bg-white shadow-md rounded-lg p-6 mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-black">
                  {selected.first_name ? `${selected.first_name} ${selected.last_name}` : selected.Name}
                </h3>
                <button
                  className="text-gray-500 hover:text-gray-800"
                  onClick={() => {
                    setSelected(null)
                    setShowFilterOptions(false)
                    setSelectedRating(null)
                  }}
                >
                  ✖
                </button>
              </div>
              <div>
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
                          setShowFilterOptions(false)
                          setSelectedRating(null)
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
                              }`}
                            onClick={() => setSelectedRating(star)}
                          >
                            {star} ดาว ({filterReviews(star, selected.rating).length})
                          </button>
                        ))}
                        <button
                          className={`px-4 py-2 text-sm rounded border-2 
                            ${
                              selectedRating === null
                                ? "bg-gray-900 text-white border-gray-900 shadow-lg"
                                : "bg-gray-700 text-white border-transparent"
                            }`}
                          onClick={() => setSelectedRating(null)}
                        >
                          รีวิวทั้งหมด ({selected.rating.length})
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Reviews ({filteredReviews.length}):</h4>
                {filteredReviews.length > 0 ? (
                  <ul className="space-y-4">
                    {filteredReviews.map((review) => (
                      <li key={review.id} className="border-b pb-4 last:border-none">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span
                                key={i}
                                className={`text-lg ${i < review.star ? "text-yellow-500" : "text-gray-300"}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <p className="text-gray-700 text-sm sm:text-base italic">"{review.comment}"</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No reviews yet.</p>
                )}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    )
  }

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
  )
}

export default ReviewAdmin

