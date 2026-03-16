from django.db import models, transaction 


class Categoria(models.Model):
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome

class Produto(models.Model):
    nome = models.CharField(max_length=200)
    sku = models.CharField(max_length=50, unique=True, help_text="Código único do item")
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True)
    quantidade_atual = models.IntegerField(default=0)
    estoque_minimo = models.IntegerField(default=5)
    descricao = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.nome} ({self.quantidade_atual})"


class Movimentacao(models.Model):
    TIPO_CHOICES = [('ENTRADA', 'Entrada'), ('SAIDA', 'Saída')]
    
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE, related_name='movimentacoes')
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    quantidade = models.IntegerField()
    data = models.DateTimeField(auto_now_add=True)
    usuario_responsavel = models.CharField(max_length=100)
    destino_origem = models.CharField(max_length=200)


    def save(self, *args, **kwargs):
        is_new = self.pk is None 
        
        with transaction.atomic():
            super().save(*args, **kwargs) 
            
            if is_new:
                if self.tipo == 'ENTRADA':
                    self.produto.quantidade_atual += self.quantidade
                
                elif self.tipo == 'SAIDA':
                    if self.produto.quantidade_atual < self.quantidade:
                        raise ValueError(f"Estoque insuficiente para {self.produto.nome}.")
                    
                    self.produto.quantidade_atual -= self.quantidade
                
                self.produto.save()

    def __str__(self):
        return f"{self.tipo} - {self.produto.nome} ({self.quantidade})"
