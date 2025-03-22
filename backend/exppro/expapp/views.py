from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from django.contrib.auth.models import User, Group
from django.db.models import Count
from .models import (
    Experiment, Video, Footnote, FootnoteInteraction,
    Questionnaire, Question, Answer, VideoProgress
)
from .serializers import (
    UserSerializer, ExperimentSerializer, VideoSerializer,
    FootnoteSerializer, QuestionnaireSerializer, QuestionSerializer,
    AnswerSerializer, VideoProgressSerializer, FootnoteInteractionSerializer
)

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        # Get user's group
        group = user.groups.first()
        group_name = group.name if group else None
        
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'username': user.username,
            'group': group_name
        })

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        
        # Get user's group
        group = user.groups.first()
        group_name = group.name if group else None
        
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'username': user.username,
            'group': group_name
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ExperimentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Experiment.objects.all()
    serializer_class = ExperimentSerializer
    permission_classes = [permissions.IsAuthenticated]

class VideoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        group = user.groups.first()
        
        if group and group.name == "Group1":
            # Group 1: Episode 1 first, then Episode 2
            return Video.objects.all().order_by('order')
        else:
            # Group 2: Episode 2 first, then Episode 1
            return Video.objects.all().order_by('-order')

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def record_video_progress(request):
    serializer = VideoProgressSerializer(data=request.data)
    if serializer.is_valid():
        # Update or create progress
        user = request.user
        video_id = serializer.validated_data['video'].id
        watched_seconds = serializer.validated_data['watched_seconds']
        completed = serializer.validated_data['completed']
        
        # # Check if the record exists
        # progress = VideoProgress.objects.filter(user=user, video=video_id).first()
        # if progress:
        #     # If found, update the record
        #     progress.watched_seconds = watched_seconds
        #     progress.completed = completed
        #     progress.save()
        # else:
        #     # If not found, create a new record
        #     progress = VideoProgress.objects.create(
        #         user=user,
        #         video=video_id,
        #         watched_seconds=watched_seconds,
        #         completed=completed
        #     )
        progress, created = VideoProgress.objects.update_or_create(
            user=user, 
            video_id=video_id,
            defaults={'watched_seconds': watched_seconds, 'completed': completed}
        )
        
        return Response(VideoProgressSerializer(progress).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def record_footnote_interaction(request):
    serializer = FootnoteInteractionSerializer(data=request.data)
    if serializer.is_valid():
        # Record the interaction
        interaction, created = FootnoteInteraction.objects.get_or_create(
            user=request.user,
            footnote_id=serializer.validated_data['footnote'].id
        )
        
        return Response(FootnoteInteractionSerializer(interaction).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class QuestionnaireViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Questionnaire.objects.all()
    serializer_class = QuestionnaireSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        video_id = self.request.query_params.get('video_id', None)
        if video_id:
            return Questionnaire.objects.filter(video_id=video_id)
        return Questionnaire.objects.all()

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def submit_answers(request):
    answers_data = request.data.get('answers', [])
    created_answers = []
    
    for answer_data in answers_data:
        answer_data['user'] = request.user.id
        serializer = AnswerSerializer(data=answer_data)
        if serializer.is_valid():
            answer = serializer.save()
            created_answers.append(AnswerSerializer(answer).data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(created_answers, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_footnote_stats(request):
    # Check if user is admin
    if not request.user.is_staff:
        return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)
    
    # Get stats on footnote interactions
    footnote_stats = FootnoteInteraction.objects.values('footnote').annotate(
        interaction_count=Count('user')
    ).order_by('footnote')
    
    # Get all footnotes for reference
    all_footnotes = Footnote.objects.all()
    footnote_map = {f.id: f for f in all_footnotes}
    
    # Format response
    result = []
    for stat in footnote_stats:
        footnote_id = stat['footnote']
        footnote = footnote_map.get(footnote_id)
        if footnote:
            result.append({
                'footnote_id': footnote_id,
                'video_title': footnote.video.title,
                'timestamp': footnote.timestamp,
                'text': footnote.text,
                'interaction_count': stat['interaction_count']
            })
    
    return Response(result)