from django.db import models
from django.contrib.auth.models import User, Group

# Create the Experiment model
class Experiment(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    consent_text = models.TextField()
    
    def __str__(self):
        return self.title

# Video model
class Video(models.Model):
    experiment = models.ForeignKey(Experiment, related_name='videos', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='videos/')
    subtitle_file = models.FileField(upload_to='subtitles/', blank=True, null=True)
    order = models.IntegerField(default=1)  # To specify order for each group
    
    def __str__(self):
        return f"{self.title} ({self.experiment.title})"

# Footnote model
class Footnote(models.Model):
    video = models.ForeignKey(Video, related_name='footnotes', on_delete=models.CASCADE)
    text = models.TextField()
    detailed_text = models.TextField()
    timestamp = models.FloatField()  # In seconds
    
    def __str__(self):
        return f"Footnote at {self.timestamp}s for {self.video.title}"

# Footnote interaction tracking
class FootnoteInteraction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    footnote = models.ForeignKey(Footnote, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'footnote')

# Questionnaire model
class Questionnaire(models.Model):
    experiment = models.ForeignKey(Experiment, related_name='questionnaires', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    video = models.ForeignKey(Video, related_name='questionnaires', on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.title} for {self.video.title}"

# Question model
class Question(models.Model):
    QUESTION_TYPES = (
        ('text', 'Text Input'),
        ('radio', 'Single Choice'),
        ('checkbox', 'Multiple Choice'),
        ('rating', 'Rating Scale'),
    )
    
    questionnaire = models.ForeignKey(Questionnaire, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()
    question_type = models.CharField(max_length=10, choices=QUESTION_TYPES)
    options = models.JSONField(blank=True, null=True)  # For radio/checkbox/rating options
    required = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.text[:30]}..."

# Answer model
class Answer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer_text = models.TextField(blank=True, null=True)
    answer_options = models.JSONField(blank=True, null=True)  # For selected options
    
    class Meta:
        unique_together = ('user', 'question')

# Video watching progress
class VideoProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE) 
    watched_seconds = models.FloatField(default=0)
    completed = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('user', 'video')