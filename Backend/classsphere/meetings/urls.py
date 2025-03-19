from django.urls import path
from .views import CreateMeetingView, GetMeetingView, MeetingListView, JoinMeetingView, EndMeetingView

urlpatterns = [
    path('meetings/create/<slug:slug>/', CreateMeetingView.as_view(), name='create_meeting'),
    path('meetings/<uuid:meeting_id>/', GetMeetingView.as_view(), name='get_meeting'),
    path('meetings/list/<slug:slug>/', MeetingListView.as_view(), name='meeting_list'),
    path('meetings/join/<uuid:meeting_id>/', JoinMeetingView.as_view(), name='join_meeting'),
    path('meetings/end/<uuid:meeting_id>/', EndMeetingView.as_view(), name='end_meeting'),
]