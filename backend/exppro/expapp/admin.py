from django.contrib import admin
from .models import (
    Experiment, Video, Footnote, FootnoteInteraction,
    Questionnaire, Question, Answer, VideoProgress
)

class FootnoteInline(admin.TabularInline):
    model = Footnote
    extra = 1

class VideoAdmin(admin.ModelAdmin):
    inlines = [FootnoteInline]
    list_display = ('title', 'experiment', 'order')
    list_filter = ('experiment',)

class VideoInline(admin.TabularInline):
    model = Video
    extra = 1

class ExperimentAdmin(admin.ModelAdmin):
    inlines = [VideoInline]
    list_display = ('title', 'description')

class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1

class QuestionnaireAdmin(admin.ModelAdmin):
    inlines = [QuestionInline]
    list_display = ('title', 'experiment', 'video')
    list_filter = ('experiment', 'video')

class AnswerAdmin(admin.ModelAdmin):
    list_display = ('user', 'question', 'answer_text')
    list_filter = ('user', 'question__questionnaire')

class VideoProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'video', 'watched_seconds', 'completed')
    list_filter = ('user', 'video', 'completed')

class FootnoteInteractionAdmin(admin.ModelAdmin):
    list_display = ('user', 'footnote', 'timestamp')
    list_filter = ('user', 'footnote__video')

admin.site.register(Experiment, ExperimentAdmin)
admin.site.register(Video, VideoAdmin)
admin.site.register(Questionnaire, QuestionnaireAdmin)
admin.site.register(Question)
admin.site.register(Answer, AnswerAdmin)
admin.site.register(VideoProgress, VideoProgressAdmin)
admin.site.register(FootnoteInteraction, FootnoteInteractionAdmin)