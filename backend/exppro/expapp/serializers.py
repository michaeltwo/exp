from rest_framework import serializers
from django.contrib.auth.models import User, Group
from .models import (
    Experiment, Video, Footnote, FootnoteInteraction,
    Questionnaire, Question, Answer, VideoProgress
)

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    group = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'group')
    
    def create(self, validated_data):
        group_name = validated_data.pop('group')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        
        # Add user to the selected group
        group, created = Group.objects.get_or_create(name=group_name)
        user.groups.add(group)
        
        return user

class FootnoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Footnote
        fields = ('id', 'text', 'detailed_text', 'timestamp')

class VideoSerializer(serializers.ModelSerializer):
    footnotes = FootnoteSerializer(many=True, read_only=True)
    
    class Meta:
        model = Video
        fields = ('id', 'title', 'file', 'subtitle_file', 'order', 'footnotes')

class ExperimentSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Experiment
        fields = ('id', 'title', 'description', 'consent_text', 'videos')

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('id', 'text', 'question_type', 'options', 'required', 'order')

class QuestionnaireSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Questionnaire
        fields = ('id', 'title', 'video', 'questions')

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ('id', 'user', 'question', 'answer_text', 'answer_options')

class VideoProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoProgress
        fields = ('id', 'user', 'video', 'watched_seconds', 'completed')
        read_only_fields = ('user',)

class FootnoteInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FootnoteInteraction
        fields = ('id', 'user', 'footnote', 'timestamp')