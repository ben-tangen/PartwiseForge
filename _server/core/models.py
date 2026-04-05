from django.conf import settings
from django.db import models

# Create your models here.


class TutorProgress(models.Model):
	user = models.OneToOneField(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name="tutor_progress",
	)
	build_stack = models.JSONField(default=list, blank=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self):
		return f"TutorProgress(user={self.user_id})"
