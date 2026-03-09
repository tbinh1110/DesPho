<?php

namespace App\Services;

class AIOrchestrator
{

    public static function parse($prompt)
    {

        $pipeline = [];

        if (preg_match('/remove|xóa/i', $prompt)) {
            $pipeline[] = "remove_bg";
        }

        if (preg_match('/upscale|4k/i', $prompt)) {
            $pipeline[] = "upscale";
        }

        if (preg_match('/enhance/i', $prompt)) {
            $pipeline[] = "enhance";
        }

        return $pipeline;
    }
}
