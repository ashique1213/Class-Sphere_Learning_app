from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import Review
from .serializers import ReviewSerializer

class ReviewCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if Review.objects.filter(user=request.user).exists():
            return Response(
                {"error": "You have already submitted a review"},
                status=status.HTTP_400_BAD_REQUEST
            )

        name = request.user.username if hasattr(request.user, 'username') else "Anonymous"
        role = getattr(request.user, 'role', 'User') if hasattr(request.user, 'role') else "User"

        serializer = ReviewSerializer(data={
            **request.data,
            'user': request.user.id,
            'name': request.data.get('name', name),
            'role': request.data.get('role', role),
        })
        
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            review = Review.objects.get(user=request.user)
            serializer = ReviewSerializer(review)
            return Response(serializer.data)
        except Review.DoesNotExist:
            return Response(
                {"error": "No review found"},
                status=status.HTTP_404_NOT_FOUND
            )

class AllReviewsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        reviews = Review.objects.filter(is_approved=True)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

class AdminAllReviewsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

class ApproveReviewView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)
            review.is_approved = True
            review.save()
            serializer = ReviewSerializer(review)
            return Response(serializer.data)
        except Review.DoesNotExist:
            return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)

class DeleteReviewView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)
            review.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Review.DoesNotExist:
            return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)