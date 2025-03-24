from django.urls import path
from .views import MaterialListCreateView, MaterialDetailView

urlpatterns = [
    path('materials/<slug:classroom_slug>/', MaterialListCreateView.as_view(), name='material-list-create'),
    path('materials/<slug:classroom_slug>/<int:pk>/', MaterialDetailView.as_view(), name='material-detail'),
]