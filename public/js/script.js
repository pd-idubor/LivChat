"use strict";

$(function() {
    var $signUpForm = $( "#signupform-form" );

    if( $signUpForm.length ) {
        $signUpForm.on( "submit", function( e ) {
            e.preventDefault();
            $signUpForm.find( ".is-invalid" ).removeClass( "is-invalid" );
            $signUpForm.find( ".invalid-feedback" ).remove();

            $.post( $signUpForm.attr( "action" ), $signUpForm.serialize(), function( res ) {
                if( res.errors ) {
                    res.errors.forEach(function( err ) {
                        $signUpForm.find( "[name=" + err.param + "]" ).addClass( "is-invalid" ).after( '<span class="invalid-feedback" role="alert"><strong>' + err. msg + '</strong></span>' );
                    });
                } else if( res.success ) {
                    window.location = "/dashboard/" + res.username;
                } else {
                    console.log( res );
                }
            });
        });
    }

    var $signInForm = $( "#signin-form" );

    if( $signInForm.length ) {
        $signInForm.on( "submit", function( e ) {
            e.preventDefault();
            $signInForm.find( ".invalid-feedback" ).remove();

            $.post( $signInForm.attr( "action" ), $signInForm.serialize(), function( res ) {
                if( !res.success ) {
                    $signInForm.append( '<span class="invalid-feedback" role="alert"><strong>Login unsuccesful</strong></span>' );
                } else {
                    window.location = "/dashboard/" + res.username;
                }
            });
        });
    }

	
var $ = $( "#follow-btn" );
if( $followBtn.length ) {
  $followBtn.click(function() {                                             var data = {                                                              follower: $followBtn.data( "follower" ),
                following: $followBtn.data( "following" ),                            action: $followBtn.data( "action" )

    var $newPostForm = $( "#new-post-form" );

    if( $newPostForm.length ) {
        $newPostForm.on( "submit", function( e ) {
            e.preventDefault();
            $newPostForm.find( ".invalid-feedback" ).remove();
            $newPostForm.find( ".is-invalid" ).removeClass( "is-invalid" );

            var formData = new FormData();
            formData.append( "description", $( "#description" ).val() );
            formData.append( "image", $( "#image" )[0].files[0] );

            var settings = {
                url: $newPostForm.attr( "action" ),
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function( res ) {
                    if( res.errors ) {
                        res.errors.forEach(function( err ) {
                            $newPostForm.find( "[name=" + err.param + "]" ).addClass( "is-invalid" ).after( '<span class="invalid-feedback" role="alert"><strong>' + err. msg + '</strong></span>' );
                        });
                    } else if( res.created ) {
                        window.location = "/posts/" + res.postid;
                    } else {
                        console.log( res );
                    }
                }
            };

            $.ajax( settings );
        });
    }
  }
  
