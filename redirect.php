<?php
if ( isset( $_GET['number'] ) && ! empty( $_GET['number'] ) ) {
	if ( ! file_exists( __DIR__ . "/src/{$_GET['number']}.m4a" ) ) {
		file_put_contents( __DIR__ . "/src/{$_GET['number']}.m4a",
			file_get_contents( "http://toolroomknightsradio.com/radioshow/mk_{$_GET['number']}.m4a" ) );
	}
}
