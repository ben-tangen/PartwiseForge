from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('api/ai/simple/', view=views.ai_simple, name="ai_simple"),
    path('api/ai/chat/', view=views.ai_chat, name="ai_chat"),
    path('api/tutor/progress/', view=views.tutor_progress, name="tutor_progress"),
    path('api/tutor/grade/q1/', view=views.tutor_grade_q1, name="tutor_grade_q1"),
]