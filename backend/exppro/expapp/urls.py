from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    signup, CustomAuthToken, ExperimentViewSet, VideoViewSet,
    QuestionnaireViewSet, record_video_progress, record_footnote_interaction,
    submit_answers, get_footnote_stats
)

router = DefaultRouter()
router.register(r'experiments', ExperimentViewSet)
router.register(r'videos', VideoViewSet, basename='video')
router.register(r'questionnaires', QuestionnaireViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', signup, name='signup'),
    path('login/', CustomAuthToken.as_view(), name='login'),
    path('video-progress/', record_video_progress, name='video-progress'),
    path('footnote-interaction/', record_footnote_interaction, name='footnote-interaction'),
    path('submit-answers/', submit_answers, name='submit-answers'),
    path('footnote-stats/', get_footnote_stats, name='footnote-stats'),
]