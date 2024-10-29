$(document).ready(function() {
    const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';
    const COMMENTS_URL = 'https://jsonplaceholder.typicode.com/comments';

    function showLoading() {
        $('#loading').show();
    }

    function hideLoading() {
        $('#loading').hide();
    }

    function loadPosts() {
        $.ajax({
            url: POSTS_URL,
            method: 'GET',
            beforeSend: function() {
                showLoading();
                $('#posts-container').html('<p>Carregando posts...</p>');
            },
            success: function(posts) {
                hideLoading();
                $('#posts-container').empty();
                posts.forEach(post => {
                    $('#posts-container').append(`
                        <div class="post" data-post-id="${post.id}">
                            <div class="post-title">${post.title}</div>
                            <div class="post-body">${post.body}</div>
                            <button class="load-comments">Carregar Comentários</button>
                            <div class="comments-container"></div>
                        </div>
                    `);
                });
            },
            error: function() {
                hideLoading();
                $('#posts-container').html('<p>Erro ao carregar os posts.</p>');
            }
        });
    }

    function loadComments(postId) {
        showLoading();
        fetch(`${COMMENTS_URL}?postId=${postId}`)
            .then(response => response.json())
            .then(comments => {
                hideLoading();
                const commentsContainer = $(`.post[data-post-id="${postId}"] .comments-container`);
                commentsContainer.empty();
                comments.forEach(comment => {
                    commentsContainer.append(`
                        <div class="comment">
                            <div class="comment-title">${comment.name} (${comment.email})</div>
                            <div class="comment-body">${comment.body}</div>
                        </div>
                    `);
                });
            })
            .catch(error => {
                hideLoading();
                console.error('Erro ao carregar os comentários:', error);
            });
    }

    $(document).on('click', '.load-comments', function() {
        const postId = $(this).closest('.post').data('post-id');
        loadComments(postId);
    });

    $('#load-all-comments').click(function() {
        showLoading();
        $('.post').each(function() {
            const postId = $(this).data('post-id');
            loadComments(postId);
        });
    });

    $('#hide-all-comments').click(function() {
        $('.comments-container').empty();
    });

    loadPosts();
});
