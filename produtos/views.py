from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Categoria, Produto, Movimentacao
from .serializers import CategoriaSerializer, ProdutoSerializer, MovimentacaoSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticated]

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
    permission_classes = [IsAuthenticated]

class MovimentacaoViewSet(viewsets.ModelViewSet):
    queryset = Movimentacao.objects.all()
    serializer_class = MovimentacaoSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
def meu_perfil(request):
    return Response({
        "nome": request.user.first_name or request.user.username,
        "cargo": "Usuário" 
    })