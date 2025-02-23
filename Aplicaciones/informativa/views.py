from django.shortcuts import render

def landing_page(request):
    return render(request, 'informativa/landing_page.html')