import os

from django.contrib.auth.decorators import login_required
from django.http import FileResponse
from django.shortcuts import render, redirect
from django_nextjs.render import render_nextjs_page_sync
from django.conf import settings


@login_required(login_url='tradehelper:login')
def arbitration(request):
    return render(request, 'frontend/index.html')


def landing(request):
    if request.user.is_anonymous:
        return render_nextjs_page_sync(request)
    else:
        return redirect("tradehelper:profile")


def download_oferta(request):
    filename = 'oferta.pdf'
    filepath = os.path.dirname(settings.BASE_DIR) + '/p2phelper/docs/' + filename
    response = FileResponse(open(filepath, 'rb'))
    response['Content-Disposition'] = f"attachment; filename={filename}"
    return response
