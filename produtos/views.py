from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Categoria, Produto, Movimentacao
from .serializers import CategoriaSerializer, ProdutoSerializer, MovimentacaoSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User

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
    def perform_create(self, serializer):
        
        serializer.save(usuario_responsavel=self.request.user)

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def meu_perfil(request):
    usuario = request.user

    # Se o React estiver pedindo os dados (GET)
    if request.method == 'GET':
        return Response({
            "username": usuario.username,
            "nome": usuario.first_name or usuario.username,
            "cargo": "Usuário" 
        })

    # Se o React estiver enviando os dados novos (PATCH)
    elif request.method == 'PATCH':
        dados = request.data
        
        # 1. Atualizando o Username (se ele vier no pacote)
        if 'username' in dados and dados['username'].strip():
            novo_username = dados['username'].strip()
            
            # Trava de segurança: verificar se outro usuário já não usa esse nome
            # (Ignorando o próprio usuário, caso ele mande o mesmo nome sem querer)
            if User.objects.filter(username=novo_username).exclude(pk=usuario.pk).exists():
                return Response(
                    {"erro": "Este nome de usuário já está em uso por outra pessoa."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            usuario.username = novo_username

        # 2. Atualizando a Senha (A Mágica da Criptografia)
        if 'password' in dados and dados['password'].strip():
            nova_senha = dados['password'].strip()
            # O set_password criptografa a senha antes de jogar no objeto
            usuario.set_password(nova_senha)

        # 3. Salvando as alterações no banco de dados
        usuario.save()

        return Response({
            "mensagem": "Perfil atualizado com sucesso!",
            "username": usuario.username
        }, status=status.HTTP_200_OK)